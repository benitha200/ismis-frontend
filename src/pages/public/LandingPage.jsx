import { Link } from 'react-router-dom';

// Find the sports events section and update the "View All" link
<Link 
  to="/events" 
  className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
>
  View All
  <ChevronRight className="w-4 h-4 ml-1" />
</Link> 