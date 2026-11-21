import { useMemo, useState } from 'react';
import { ArrowLeft, Download, MessageSquare, Scissors, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

const pageCount = 5000;

export default function DocumentWorkspace() {
  const { claimId } = useParams();
  const navigate = useNavigate();
  const claim = useAppSelector(state =>
    state.claims.claims.find(item => item.id === claimId)
  );
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [pageLoading, setPageLoading] = useState(false);
  const [jumpPage, setJumpPage] = useState('1');
  const [operation, setOperation] = useState<'edit' | 'split' | 'merge' | 'delete' | null>(null);
  const [documentTitle, setDocumentTitle] = useState('Vehicle Damage Assessment');
  const [draftTitle, setDraftTitle] = useState(documentTitle);
  const [splitStart, setSplitStart] = useState('1');
  const [splitEnd, setSplitEnd] = useState(String(page));
  const [mergeFileName, setMergeFileName] = useState('Police_Report.pdf');
  const [derivedPages, setDerivedPages] = useState<number | null>(null);
  const [deleted, setDeleted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [pageComments, setPageComments] = useState<Record<number, string[]>>({});

  const thumbnails = useMemo(
    () => {
      const windowStart = Math.max(1, Math.min(pageCount - 11, page - 5));
      return Array.from(
        { length: 12 },
        (_, index) => windowStart + index
      );
    },
    [page]
  );

  const runOperation = (operationName: string) => {
    setMessage(`${operationName} job queued for processing`);
  };

  const openOperation = (nextOperation: 'edit' | 'split' | 'merge' | 'delete') => {
    if (nextOperation === 'edit') setDraftTitle(documentTitle);
    if (nextOperation === 'split') {
      setSplitStart(String(page));
      setSplitEnd(String(Math.min(pageCount, page)));
    }
    setOperation(nextOperation);
  };

  const applyOperation = () => {
    if (operation === 'edit') {
      setDocumentTitle(draftTitle.trim() || documentTitle);
      setMessage(`Page ${page} edits saved`);
    }

    if (operation === 'split') {
      const start = Math.max(1, Number.parseInt(splitStart, 10) || 1);
      const end = Math.min(pageCount, Number.parseInt(splitEnd, 10) || start);
      if (end >= start) {
        setDerivedPages(end - start + 1);
        setMessage(`Split completed: ${end - start + 1} pages created`);
      } else {
        setMessage('Split failed: end page must be after start page');
        setOperation(null);
        return;
      }
    }

    if (operation === 'merge') {
      setDerivedPages((current) => (current ?? 0) + 120);
      setMessage(`${mergeFileName.trim() || 'Document.pdf'} merged successfully`);
    }

    if (operation === 'delete') {
      setDeleted(true);
      setMessage('Document moved to deleted items');
    }

    setProcessing(true);
    window.setTimeout(() => {
      setProcessing(false);
      setOperation(null);
    }, 450);
  };

  const changePage = (nextPage: number) => {
    if (nextPage === page) return;

    setPageLoading(true);
    setPage(nextPage);
    setJumpPage(String(nextPage));
    window.setTimeout(() => setPageLoading(false), 180);
  };

  const jumpToPage = () => {
    const requestedPage = Number.parseInt(jumpPage, 10);

    if (Number.isNaN(requestedPage)) return;

    changePage(Math.min(pageCount, Math.max(1, requestedPage)));
  };

  return (
    <div className="h-[calc(100vh-112px)] overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
      <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4">
        <div className="flex items-center gap-3">
          <button
            className="inline-flex items-center gap-2 text-sm text-slate-600"
            onClick={() => navigate(`/claims/${claimId}`)}
          >
            <ArrowLeft size={16} /> Claim
          </button>
          <div className="h-6 border-l border-slate-200" />
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Claim_Report.pdf
            </p>
            <p className="text-xs text-slate-500">
              {claim?.documentSize ?? '1 GB'} · {pageCount.toLocaleString()} pages
            </p>
            {derivedPages !== null && (
              <p className="text-xs text-emerald-600">
                {derivedPages.toLocaleString()} derived pages
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-md border border-slate-200 px-3 py-2 text-sm" onClick={() => openOperation('edit')}>
            Edit
          </button>
          <button className="rounded-md border border-slate-200 px-3 py-2 text-sm" onClick={() => openOperation('split')}>
            <Scissors className="mr-1 inline" size={15} /> Split
          </button>
          <button className="rounded-md border border-slate-200 px-3 py-2 text-sm" onClick={() => openOperation('merge')}>
            Merge
          </button>
          <button className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-600" onClick={() => openOperation('delete')}>
            <Trash2 className="mr-1 inline" size={15} /> Delete
          </button>
          <button className="rounded-md border border-slate-200 p-2" title="Download" onClick={() => runOperation('Download')}>
            <Download size={16} />
          </button>
        </div>
      </header>

      {message && (
        <div className="absolute right-6 top-20 z-20 rounded-lg bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">
          {message}
        </div>
      )}

      {operation && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-900/20">
          <div className="w-[420px] rounded-xl bg-white p-5 shadow-2xl">
            <h2 className="text-lg font-semibold text-slate-800">
              {operation === 'edit' && 'Edit document'}
              {operation === 'split' && 'Split PDF'}
              {operation === 'merge' && 'Merge PDF'}
              {operation === 'delete' && 'Delete document'}
            </h2>

            {operation === 'edit' && (
              <label className="mt-4 block text-sm text-slate-600">
                Document title
                <input
                  value={draftTitle}
                  onChange={event => setDraftTitle(event.target.value)}
                  className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2"
                />
              </label>
            )}

            {operation === 'split' && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <label className="text-sm text-slate-600">
                  Start page
                  <input
                    type="number"
                    min={1}
                    max={pageCount}
                    value={splitStart}
                    onChange={event => setSplitStart(event.target.value)}
                    className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2"
                  />
                </label>
                <label className="text-sm text-slate-600">
                  End page
                  <input
                    type="number"
                    min={1}
                    max={pageCount}
                    value={splitEnd}
                    onChange={event => setSplitEnd(event.target.value)}
                    className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2"
                  />
                </label>
              </div>
            )}

            {operation === 'merge' && (
              <label className="mt-4 block text-sm text-slate-600">
                Document to merge
                <input
                  value={mergeFileName}
                  onChange={event => setMergeFileName(event.target.value)}
                  className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2"
                />
              </label>
            )}

            {operation === 'delete' && (
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Move Claim_Report.pdf to deleted items? It can be restored until it is permanently removed.
              </p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                className="rounded-md border border-slate-200 px-4 py-2 text-sm"
                disabled={processing}
                onClick={() => setOperation(null)}
              >
                Cancel
              </button>
              <button
                className={`rounded-md px-4 py-2 text-sm text-white ${
                  operation === 'delete' ? 'bg-red-600' : 'bg-blue-600'
                }`}
                disabled={processing}
                onClick={applyOperation}
              >
                {processing ? 'Processing...' : operation === 'delete' ? 'Delete' : 'Apply'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid h-[calc(100%-56px)] grid-cols-[150px_minmax(420px,1fr)_280px]">
        {deleted && (
          <div className="absolute inset-x-[150px] bottom-0 top-14 z-20 flex items-center justify-center bg-slate-100/95">
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-lg">
              <Trash2 className="mx-auto text-red-500" size={28} />
              <h2 className="mt-3 font-semibold text-slate-800">Document deleted</h2>
              <p className="mt-1 text-sm text-slate-500">Claim_Report.pdf is in deleted items.</p>
              <button
                className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm text-white"
                onClick={() => {
                  setDeleted(false);
                  setMessage('Document restored');
                }}
              >
                Restore document
              </button>
            </div>
          </div>
        )}
        <aside className="overflow-y-auto border-r border-slate-200 bg-white p-3">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Pages
          </p>
          <div className="mb-3">
            <label className="mb-1 block text-xs text-slate-500" htmlFor="page-jump">
              Go to page
            </label>
            <div className="flex items-center gap-1">
              <input
                id="page-jump"
                type="number"
                min={1}
                max={pageCount}
                value={jumpPage}
                onChange={event => setJumpPage(event.target.value)}
                onKeyDown={event => {
                  if (event.key === 'Enter') jumpToPage();
                }}
                className="min-w-0 flex-1 rounded border border-slate-200 px-2 py-1 text-xs"
              />
              <button
                type="button"
                onClick={jumpToPage}
                className="rounded border border-slate-200 px-2 py-1 text-xs text-blue-600"
              >
                Go
              </button>
            </div>
          </div>
          {thumbnails.map(thumbnailPage => (
            <button
              key={thumbnailPage}
              className={`mb-3 w-full rounded-md border p-2 ${
                page === thumbnailPage
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 bg-slate-50'
              }`}
              onClick={() => changePage(thumbnailPage)}
            >
              <div className="mx-auto h-24 w-16 bg-white shadow-sm" />
              <span className="mt-2 block text-xs text-slate-500">
                Page {thumbnailPage}
              </span>
            </button>
          ))}
        </aside>

        <main className="overflow-auto bg-slate-200 p-8">
          {pageLoading && (
            <div className="mx-auto mb-3 max-w-[612px] rounded-md bg-white px-4 py-2 text-center text-xs text-slate-500 shadow-sm">
              Loading page {page}...
            </div>
          )}
          <div
            key={page}
            className="mx-auto min-h-[760px] origin-top bg-white shadow-xl"
            style={{ width: `${612 * zoom / 100}px` }}
          >
            <div className="flex h-full flex-col px-12 py-10" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left', width: `${10000 / zoom}%` }}>
              <div className="border-b-2 border-slate-800 pb-4">
                <p className="text-xs font-bold text-blue-800">ABC INSURANCE</p>
                <p className="mt-1 text-sm text-slate-500">Claim Assessment Report</p>
              </div>
              <h1 className="mt-8 text-2xl font-bold text-slate-900">
                {documentTitle}
              </h1>
              <div className="mt-3 inline-flex w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                Page {page} preview
              </div>
              <div className="mt-6 grid grid-cols-2 border border-slate-200 text-sm">
                <div className="border-b border-r border-slate-200 p-3">
                  <span className="block text-xs text-slate-400">Claim</span>
                  {claimId}
                </div>
                <div className="border-b border-slate-200 p-3">
                  <span className="block text-xs text-slate-400">Claimant</span>
                  {claim?.claimantName ?? 'Unknown'}
                </div>
              </div>
              <p className="mt-8 text-sm leading-7 text-slate-600">
                This page is a lightweight workspace preview. In production, PDF.js
                renders this page from document byte ranges while distant pages remain unloaded.
              </p>
              <div className="absolute bottom-12 right-12 text-xs text-slate-400">
                Page {page} of {pageCount.toLocaleString()}
              </div>
            </div>
          </div>
        </main>

        <aside className="border-l border-slate-200 bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-semibold text-slate-800">Page comments</p>
            <MessageSquare size={17} className="text-slate-400" />
          </div>
          <p className="mb-3 text-xs text-slate-500">Page {page}</p>
          <textarea
            value={comment}
            onChange={event => setComment(event.target.value)}
            placeholder="Add a page-level comment or annotation..."
            className="h-24 w-full resize-none rounded-lg border border-slate-200 p-3 text-sm"
          />
          <button
            className="mt-2 w-full rounded-md bg-blue-600 px-3 py-2 text-sm text-white"
            onClick={() => {
              if (comment.trim()) {
                setMessage(`Comment saved on page ${page}`);
                setPageComments(current => ({
                  ...current,
                  [page]: [...(current[page] ?? []), comment.trim()],
                }));
                setComment('');
              }
            }}
          >
            Save comment
          </button>
          {(pageComments[page]?.length ?? 0) > 0 && (
            <div className="mt-4 space-y-2">
              {(pageComments[page] ?? []).map((savedComment, index) => (
                <div key={`${page}-${index}`} className="rounded-md border border-slate-200 bg-slate-50 p-2 text-xs text-slate-600">
                  {savedComment}
                </div>
              ))}
            </div>
          )}
          <div className="mt-5 border-t border-slate-200 pt-4">
            <p className="mb-2 text-xs font-semibold text-slate-500">Zoom</p>
            <div className="flex items-center gap-2">
              <button className="rounded border border-slate-200 px-2" onClick={() => setZoom(Math.max(60, zoom - 10))}>−</button>
              <span className="text-sm">{zoom}%</span>
              <button className="rounded border border-slate-200 px-2" onClick={() => setZoom(Math.min(160, zoom + 10))}>+</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
