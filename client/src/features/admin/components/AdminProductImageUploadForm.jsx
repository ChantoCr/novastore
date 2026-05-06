import { useEffect, useState } from 'react';

function AdminProductImageUploadForm({ isSubmitting = false, onSubmit, product }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [altText, setAltText] = useState('');
  const [makePrimary, setMakePrimary] = useState(true);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    setSelectedFile(null);
    setAltText(product?.name || '');
    setMakePrimary(true);
    setLocalError(null);
  }, [product]);

  function handleFormSubmit(event) {
    event.preventDefault();
    setLocalError(null);

    if (!product) {
      setLocalError('Select a product before uploading an image.');
      return;
    }

    if (!selectedFile) {
      setLocalError('Choose an image file before submitting.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('altText', altText);
    formData.append('makePrimary', String(makePrimary));

    onSubmit(formData);
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-violet-300">Admin product image</p>
          <h3 className="text-2xl font-semibold text-white">
            {product ? `Upload media for ${product.name}` : 'Select a product to upload media'}
          </h3>
        </div>
        {product?.primaryImageUrl ? (
          <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-emerald-100">
            Primary image available
          </span>
        ) : null}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80">
          {product?.primaryImageUrl ? (
            <img
              src={product.primaryImageUrl}
              alt={product.name}
              className="h-full min-h-[220px] w-full object-cover"
            />
          ) : (
            <div className="flex min-h-[220px] items-center justify-center px-6 text-center text-sm text-slate-400">
              No uploaded primary image yet. The first successful upload can become the product cover.
            </div>
          )}
        </div>

        <form className="grid gap-4" onSubmit={handleFormSubmit} noValidate>
          <label className="text-sm text-slate-200">
            Image file
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
              className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white file:mr-4 file:rounded-full file:border-0 file:bg-violet-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
              disabled={!product || isSubmitting}
            />
            <span className="mt-2 block text-xs text-slate-400">
              Allowed: JPG, PNG, WEBP, GIF. Keep files lightweight for local portfolio workflows.
            </span>
          </label>

          <label className="text-sm text-slate-200">
            Alt text
            <input
              type="text"
              value={altText}
              onChange={(event) => setAltText(event.target.value)}
              maxLength={180}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
              disabled={!product || isSubmitting}
            />
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={makePrimary}
              onChange={(event) => setMakePrimary(event.target.checked)}
              className="h-4 w-4"
              disabled={!product || isSubmitting}
            />
            Make this the primary product image
          </label>

          {localError ? (
            <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {localError}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={!product || isSubmitting}
            className="rounded-full bg-violet-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Uploading...' : 'Upload product image'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default AdminProductImageUploadForm;
