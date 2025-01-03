import React from 'react';

const Nav: React.FC = () => {
  //Add necessary code to display the navigation bar and link between the pages
  return (
    <div>
        <nav>
            <ul>
                <li>
                    {/* Add link to the Home page */}
                    <a href="/">Home</a>
                </li>
                <li>
                    {/* Add link to the Search page */}
                    <a href="/Potential Candidate">Search Potential Candidate</a>
                </li>
                <li>
                    {/* Add link to the Saved Candidate page */}
                    <a href="/savedCandidates">Saved Potential Candidate</a>
                </li>
            </ul>
        </nav>
    </div>
  )
};

export default Nav;
