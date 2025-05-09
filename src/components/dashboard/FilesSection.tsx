import { recentFiles } from '@/data/mockData';

export function FilesSection() {
  return (
    <div className="bg-white/20 backdrop-blur-xl backdrop-filter rounded-lg p-6 
      border border-white/20">
      <h2 className="text-lg font-semibold text-black mb-6">Recent Files</h2>
      <div className="space-y-4">
        {recentFiles.map(file => (
          <div key={file.id} className="flex items-center justify-between p-3 
            bg-white/10 rounded-lg hover:bg-white/20 transition duration-300 cursor-pointer">
            <div className="flex items-center">
              <div className="p-2 bg-white/10 rounded-md">
                <svg className="w-4 h-4 text-black/70" fill="none" stroke="currentColor" 
                  viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-black">{file.name}</p>
                <p className="text-xs text-black/70">
                  By {file.uploadedBy} • {file.date}
                </p>
              </div>
            </div>
            <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors">
              <svg className="w-4 h-4 text-black/70" fill="none" stroke="currentColor" 
                viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <button className="w-full text-center text-sm text-black/80 hover:text-black 
        font-medium mt-4 transition-colors">
        View All Files
      </button>
    </div>
  );
}