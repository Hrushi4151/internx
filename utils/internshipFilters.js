export function filterInternships(internships, filters) {
  return internships.filter(internship => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = 
        internship.title.toLowerCase().includes(searchTerm) ||
        internship.company.toLowerCase().includes(searchTerm);
      if (!matchesSearch) return false;
    }

    // Duration filter
    if (filters.duration) {
      const duration = parseInt(internship.duration);
      switch (filters.duration) {
        case '1-3':
          if (duration < 1 || duration > 3) return false;
          break;
        case '3-6':
          if (duration < 3 || duration > 6) return false;
          break;
        case '6+':
          if (duration < 6) return false;
          break;
      }
    }

    // Location filter
    if (filters.location) {
      const locationTerm = filters.location.toLowerCase();
      if (!internship.location.toLowerCase().includes(locationTerm)) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'deadline':
        return new Date(a.deadline) - new Date(b.deadline);
      case 'stipend-high':
        return parseFloat(b.stipend) - parseFloat(a.stipend);
      case 'stipend-low':
        return parseFloat(a.stipend) - parseFloat(b.stipend);
      default: // newest
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });
} 