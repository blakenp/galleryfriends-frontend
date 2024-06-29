'use client'

import React from 'react';

export default function Footer() {
  const githubRepos = [
    {
      name: 'Github Frontend Repo',
      url: 'https://github.com/blakenp/galleryfriends-frontend',
    },
    {
      name: 'Github Backend Repo',
      url: 'https://github.com/blakenp/gallery-friends-backend-copy',
    },
  ];

  const handleGithubLink = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="bg-gray-900 text-white p-4 left-0 w-full">
      <div className="flex justify-end">
        {githubRepos.map((repo) => (
          <button
            key={repo.name}
            className="text-gray-300 hover:text-white mx-2"
            onClick={() => handleGithubLink(repo.url)}
          >
            {repo.name}
          </button>
        ))}
      </div>
    </div>
  );
}
