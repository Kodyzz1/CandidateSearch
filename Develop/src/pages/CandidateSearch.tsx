import { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import { Candidate } from '../interfaces/Candidate.interface.tsx';

const CandidateSearch = () => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error , setError] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [userSearchError, setUserSearchError] = useState<string>('');
useEffect(() => {
    const fetchCandidates = async () => {
        try {
            const data = await searchGithub();
            const formattedCandidates = data.map((item: { id: number; login: string; location: string | null; avatar_url: string; email: string | null; html_url: string }) => ({
                id: item.id,
                name: item.login,
                username: item.login,
                location: item.location || null,
                avatar: item.avatar_url,
                email: item.email || null,
                html_url: item.html_url,
                company: null,
            }));
            setCandidates(formattedCandidates);
        } catch (error) {
            setError('Error fetching candidates');
        }
        setLoading(false);
    }
    fetchCandidates();
}, []);

const handleUserSearch = async () => {
    if (searchQuery.trim() === '') {
        setUserSearchError('Please enter a search query');
        return;
    }

    try {
        const data = await searchGithubUser(searchQuery);
        const searchedUser: Candidate = {
            id: data.id,
            name: data.login,
            username: data.login,
            location: data.location || 'cannot fetch location',
            avatar: data.avatar_url,
            email: data.email || null,
            html_url: data.html_url,
            company: data.company || 'employer not found',
        };
        setCandidates([searchedUser]);
        setCurrentIndex(0);
    } catch (error) {
        setUserSearchError('User not found');
    }
}

const saveCandidate = (currentIndex: number, candidates: Candidate[]) => {
    const candidateToSave = candidates[currentIndex];
    const savedCandidates = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
    savedCandidates.push(candidateToSave);
    localStorage.setItem('savedCandidates', JSON.stringify(savedCandidates));
    nextCandidate(candidates);
  };

  const removeCandidate = (currentIndex: number, candidates: Candidate[]) => {
    const savedCandidates = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
    const updatedCandidates = savedCandidates.filter(
      (candidate: Candidate) => candidate.id !== candidates[currentIndex].id
    );
    localStorage.setItem('savedCandidates', JSON.stringify(updatedCandidates));
    nextCandidate(candidates);
  };

  const nextCandidate = (candidates: Candidate[]) => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex < candidates.length - 1) {
        return prevIndex + 1;
      } else {
        alert('No more candidates available.');
        return prevIndex;
      }
    });
  };

  if (loading) {
    return <h2>Loading candidates...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  const currentCandidate = candidates[currentIndex];

  return (
    <div>
      <h1>Candidate Search</h1>

      <div>
        <input 
          type="text" 
          placeholder="Search GitHub User" 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
        <button onClick={handleUserSearch}>Search</button>
        {userSearchError && <p>{userSearchError}</p>}
      </div>

      {currentCandidate ? (
        <div key={currentCandidate.id} className="candidate-card">
          <img
            src={currentCandidate.avatar}
            alt={`${currentCandidate.name}'s avatar`}
            className="candidate-avatar"
          />
          
          <div className="candidate-info">
            <h2>{currentCandidate.name}</h2>
            <p>
              <a href={currentCandidate.html_url} target="_blank" rel="noopener noreferrer">
                View GitHub Profile
              </a>
            </p>
            <p>{currentCandidate.location}</p> 
          </div>
        </div>
      ) : (
        <p> candidates not found.</p>
      )}

      <div>
        <button onClick={() => removeCandidate(currentIndex, candidates)}>Reject</button>
        <button onClick={() => saveCandidate(currentIndex, candidates)}>Save</button>
        <button onClick={() => nextCandidate(candidates)}>Next</button>
      </div>
    </div>
  );
};

export default CandidateSearch;

