import React, { useState, useEffect } from 'react';
import './ResultDisplay3.css';

// Task Table Component
const ResultDisplay3 = ({
  data = [],
  initialSortField = 'task',
  initialSortOrder = 'asc',
  itemsPerPage = 10,
  onRowClick = () => {},
  className = '',
  emptyMessage = 'No tasks available',
  loading = false
}) => {
  // State for sorting
  const [sortField, setSortField] = useState(initialSortField);
  const [sortOrder, setSortOrder] = useState(initialSortOrder);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filtered and sorted data
  const [filteredData, setFilteredData] = useState(data);
  
  // Apply sorting and filtering
  useEffect(() => {
    let result = [...data];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(task => 
        task.task.toLowerCase().includes(query) ||
        task.duration.toString().includes(query) ||
        task.start_time.toString().includes(query) ||
        task.end_time.toString().includes(query) ||
        task.resource_needed.toString().includes(query)
      );
    }
    
    // Apply sorting
    if (sortField) {
      result.sort((a, b) => {
        if (sortOrder === 'asc') {
          return a[sortField] - b[sortField];
        } else {
          return b[sortField] - a[sortField];
        }
      });
    }
    
    setFilteredData(result);
    setCurrentPage(1); // Reset to first page when data changes
  }, [data, sortField, sortOrder, searchQuery]);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Handle column sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };
  
  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  return (
    <div className={`task-table-container ${className}`}>
      {/* Loading Indicator */}
      {loading && (
        <div className="task-table-loading">
          <div className="task-table-spinner"></div>
          <p>Loading tasks...</p>
        </div>
      )}
      
      {/* Table */}
      {!loading && (
        <div className="task-table-wrapper">
          <table className="task-table">
            <thead>
              <tr>
                <th
                  onClick={() => handleSort('task')}
                  className={`task-table-header ${sortField === 'task' ? `task-table-sorted-${sortOrder}` : ''}`}
                >
                  Task
                  {sortField === 'task' && (
                    <span className="task-table-sort-icon">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th
                  onClick={() => handleSort('duration')}
                  className={`task-table-header ${sortField === 'duration' ? `task-table-sorted-${sortOrder}` : ''}`}
                >
                  Duration
                  {sortField === 'duration' && (
                    <span className="task-table-sort-icon">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th
                  onClick={() => handleSort('start_time')}
                  className={`task-table-header ${sortField === 'start_time' ? `task-table-sorted-${sortOrder}` : ''}`}
                >
                  Start Time
                  {sortField === 'start_time' && (
                    <span className="task-table-sort-icon">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th
                  onClick={() => handleSort('end_time')}
                  className={`task-table-header ${sortField === 'end_time' ? `task-table-sorted-${sortOrder}` : ''}`}
                >
                  End Time
                  {sortField === 'end_time' && (
                    <span className="task-table-sort-icon">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th
                  onClick={() => handleSort('resource_needed')}
                  className={`task-table-header ${sortField === 'resource_needed' ? `task-table-sorted-${sortOrder}` : ''}`}
                >
                  Resource Needed
                  {sortField === 'resource_needed' && (
                    <span className="task-table-sort-icon">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((task, index) => (
                  <tr
                    key={index}
                    onClick={() => onRowClick(task)}
                    className="task-table-row"
                  >
                    <td className="task-table-cell">{task.task}</td>
                    <td className="task-table-cell">{task.duration}</td>
                    <td className="task-table-cell">{task.start_time}</td>
                    <td className="task-table-cell">{task.end_time}</td>
                    <td className="task-table-cell">{task.resource_needed}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="task-table-empty">
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Pagination */}
      {!loading && filteredData.length > 0 && (
        <div className="task-table-pagination">
          <div className="task-table-pagination-info">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)} - {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} tasks
          </div>
          <div className="task-table-pagination-controls">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="task-table-pagination-button"
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`task-table-pagination-button ${currentPage === pageNum ? 'task-table-pagination-active' : ''}`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="task-table-pagination-ellipsis">...</span>
            )}
            
            {totalPages > 5 && currentPage > 3 && (
              <>
                <span className="task-table-pagination-ellipsis">...</span>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className={`task-table-pagination-button ${currentPage === totalPages ? 'task-table-pagination-active' : ''}`}
                >
                  {totalPages}
                </button>
              </>
            )}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="task-table-pagination-button"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay3;
