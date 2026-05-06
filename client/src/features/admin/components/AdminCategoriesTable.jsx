function formatDate(value) {
  if (!value) {
    return 'Unknown date';
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function AdminCategoriesTable({ categories = [], isToggling = false, onEdit, onToggleStatus }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-200">
          <thead className="bg-slate-950/70 text-xs uppercase tracking-[0.25em] text-slate-400">
            <tr>
              <th className="px-4 py-4 font-medium">Category</th>
              <th className="px-4 py-4 font-medium">Slug</th>
              <th className="px-4 py-4 font-medium">Visibility</th>
              <th className="px-4 py-4 font-medium">Assigned products</th>
              <th className="px-4 py-4 font-medium">Updated</th>
              <th className="px-4 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-slate-950/40">
            {categories.map((category) => (
              <tr key={category.id} className="align-top">
                <td className="px-4 py-4">
                  <div>
                    <p className="font-medium text-white">{category.name}</p>
                    <p className="mt-1 max-w-md text-xs leading-6 text-slate-400">
                      {category.description || 'No description provided for this category yet.'}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-4 font-mono text-xs text-violet-200">{category.slug}</td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      category.isActive
                        ? 'border border-emerald-400/20 bg-emerald-500/10 text-emerald-200'
                        : 'border border-amber-400/20 bg-amber-500/10 text-amber-200'
                    }`}
                  >
                    {category.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-4 text-slate-300">{category.productCount ?? 0}</td>
                <td className="px-4 py-4 text-slate-300">{formatDate(category.updatedAt)}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(category)}
                      className="rounded-full border border-white/10 px-3 py-2 text-xs text-slate-200 transition hover:border-violet-400/30 hover:text-white"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={isToggling}
                      onClick={() => onToggleStatus(category)}
                      className="rounded-full border border-white/10 px-3 py-2 text-xs text-slate-200 transition hover:border-violet-400/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {category.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminCategoriesTable;
