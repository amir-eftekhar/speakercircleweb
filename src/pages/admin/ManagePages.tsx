import React, { useEffect, useState } from 'react';
import { Edit, Save, X, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const ManagePages: React.FC = () => {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('slug');
      
      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (page: any) => {
    setEditingPage(page.id);
    setEditContent(page.content);
  };

  const cancelEditing = () => {
    setEditingPage(null);
    setEditContent('');
  };

  const saveChanges = async (pageId: string) => {
    try {
      const { error } = await supabase
        .from('pages')
        .update({ 
          content: editContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', pageId);
      
      if (error) throw error;
      
      await fetchPages();
      setEditingPage(null);
      setEditContent('');
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Error saving changes. Please try again.');
    }
  };

  const pageDescriptions = {
    home: 'Main homepage content and introduction',
    about: 'About page general content',
    mission: 'Mission statement for the organization',
    vision: 'Vision statement and future goals',
    'founder-bio': 'Founder biography and background'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Pages</h1>
            <p className="text-gray-600 mt-2">Edit website content and page information</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {pages.map((page) => (
            <div key={page.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {page.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Slug: <code className="bg-gray-100 px-2 py-1 rounded">{page.slug}</code>
                    </p>
                    <p className="text-sm text-gray-500">
                      {pageDescriptions[page.slug as keyof typeof pageDescriptions] || 'Page content'}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Last updated: {new Date(page.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {editingPage === page.id ? (
                      <>
                        <button
                          onClick={() => saveChanges(page.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => startEditing(page)}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </button>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4">
                  {editingPage === page.id ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content
                      </label>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={10}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none font-mono text-sm"
                        placeholder="Enter page content..."
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        You can use HTML and markdown formatting in the content.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Content
                      </label>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-700 whitespace-pre-wrap">
                          {page.content.length > 500 
                            ? `${page.content.substring(0, 500)}...`
                            : page.content
                          }
                        </div>
                        {page.content.length > 500 && (
                          <p className="text-xs text-gray-500 mt-2">
                            Content truncated. Click Edit to view full content.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {pages.length === 0 && (
          <div className="text-center py-16">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Pages Found</h3>
            <p className="text-gray-600">No pages are available to edit.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePages;