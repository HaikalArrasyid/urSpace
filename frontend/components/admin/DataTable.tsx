'use client';

interface Column<T> {
    header: string;
    key: string;
    className?: string;
    render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    keyExtractor: (item: T) => string | number;
    emptyMessage?: string;
    pagination?: {
        currentPage: number;
        totalPages: number;
        onPageChange: (page: number) => void;
    };
}

export function DataTable<T>({ 
    columns, 
    data, 
    keyExtractor, 
    emptyMessage = "Tidak ada data ditemukan.",
    pagination 
}: DataTableProps<T>) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                    <thead className="bg-slate-50/50">
                        <tr>
                            {columns.map((col, idx) => (
                                <th 
                                    key={idx} 
                                    className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-100 ${col.className || ''}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center text-sm font-bold text-slate-400">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr key={keyExtractor(item)} className="hover:bg-slate-50/50 transition-colors">
                                    {columns.map((col, idx) => (
                                        <td key={idx} className={`px-6 py-4 text-sm font-medium text-slate-700 ${col.className || ''}`}>
                                            {col.render ? col.render(item) : (item as any)[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            {pagination && pagination.totalPages > 1 && (
                <div className="bg-white px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                    <button 
                        onClick={() => pagination.onPageChange(Math.max(1, pagination.currentPage - 1))}
                        disabled={pagination.currentPage === 1}
                        className="h-9 px-4 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 border border-slate-200 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors shadow-sm"
                    >
                        Previous
                    </button>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Halaman {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <button 
                         onClick={() => pagination.onPageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))}
                         disabled={pagination.currentPage === pagination.totalPages}
                         className="h-9 px-4 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 border border-slate-200 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors shadow-sm"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
