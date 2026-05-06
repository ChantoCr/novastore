import { dbPool } from '../config/db.js';
import { createAuditLogRecord } from '../repositories/audit.repository.js';
import {
  createCategory,
  findCategoryByIdentifier,
  findCategoryByNameOrSlug,
  listActiveCategories,
  listManagedCategories,
  updateCategoryByIdentifier,
} from '../repositories/category.repository.js';
import { AppError } from '../utils/appError.js';

function buildAuditContext(actor) {
  return {
    adminUserId: actor.adminUserId,
    ipAddress: actor.ipAddress,
    userAgent: actor.userAgent,
  };
}

function mapCategoryMutationError(error) {
  if (error?.code === 'ER_DUP_ENTRY') {
    return new AppError('A category with this slug already exists', 409);
  }

  return error;
}

async function ensureCategoryUniqueness({ name, slug }, { excludeId = null, executor } = {}) {
  if (!name && !slug) {
    return;
  }

  const conflictingCategory = await findCategoryByNameOrSlug(
    {
      name,
      slug,
      excludeId,
    },
    executor,
  );

  if (!conflictingCategory) {
    return;
  }

  if (slug && conflictingCategory.slug === slug) {
    throw new AppError('A category with this slug already exists', 409);
  }

  if (name && conflictingCategory.name.toLowerCase() === name.toLowerCase()) {
    throw new AppError('A category with this name already exists', 409);
  }

  throw new AppError('Category conflicts with an existing record', 409);
}

export async function getActiveCategories() {
  return listActiveCategories();
}

export async function getManagedCategories(query) {
  return listManagedCategories({
    search: query.search?.trim() || '',
    status: query.status || 'all',
  });
}

export async function createCategoryRecord(payload, actor) {
  const connection = await dbPool.getConnection();

  try {
    await connection.beginTransaction();

    await ensureCategoryUniqueness(
      {
        name: payload.name,
        slug: payload.slug,
      },
      { executor: connection },
    );

    const categoryId = await createCategory(payload, connection);
    const category = await findCategoryByIdentifier(String(categoryId), { executor: connection });

    if (!category) {
      throw new AppError('Category created but could not be loaded', 500);
    }

    await createAuditLogRecord(
      {
        ...buildAuditContext(actor),
        action: 'category_created',
        entityType: 'category',
        entityId: category.id,
        oldValue: null,
        newValue: category,
      },
      connection,
    );

    await connection.commit();

    return category;
  } catch (error) {
    await connection.rollback();
    throw mapCategoryMutationError(error);
  } finally {
    connection.release();
  }
}

export async function updateCategoryRecord(identifier, payload, actor) {
  const connection = await dbPool.getConnection();

  try {
    await connection.beginTransaction();

    const currentCategory = await findCategoryByIdentifier(identifier, { executor: connection });

    if (!currentCategory) {
      throw new AppError('Category not found', 404);
    }

    await ensureCategoryUniqueness(
      {
        name: payload.name,
        slug: payload.slug,
      },
      {
        excludeId: currentCategory.id,
        executor: connection,
      },
    );

    const affectedRows = await updateCategoryByIdentifier(identifier, payload, connection);

    if (!affectedRows) {
      throw new AppError('Category not found or no changes were applied', 404);
    }

    const category = await findCategoryByIdentifier(String(currentCategory.id), { executor: connection });

    if (!category) {
      throw new AppError('Category updated but could not be loaded', 500);
    }

    const action =
      Object.keys(payload).length === 1 && Object.prototype.hasOwnProperty.call(payload, 'isActive')
        ? 'category_status_changed'
        : 'category_updated';

    await createAuditLogRecord(
      {
        ...buildAuditContext(actor),
        action,
        entityType: 'category',
        entityId: category.id,
        oldValue: currentCategory,
        newValue: category,
      },
      connection,
    );

    await connection.commit();

    return category;
  } catch (error) {
    await connection.rollback();
    throw mapCategoryMutationError(error);
  } finally {
    connection.release();
  }
}
