'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface TeamMember {
  _id: string
  title: string
  designation: string
  singleImage: string
}

interface ApiResponse {
  success: boolean
  products: TeamMember[]
  totalPages: number
  currentPage: number
}

const TeamMember = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTeamMembers = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`https://server-gs.vercel.app/admin/team-member?page=${currentPage}`)
        const data: ApiResponse = await response.json()
        
        if (data.success) {
          setTeamMembers(data.products)
          setTotalPages(data.totalPages)
        }
      } catch (error) {
        console.error('Error fetching team members:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeamMembers()
  }, [currentPage])

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-start  text-rose-900">Our Team</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teamMembers.map((member) => (
          <a 
          key={member._id}
          href="#" // Replace with actual link if available
          className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row md:max-w-2xl hover:bg-gray-50 transition-all duration-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 group overflow-hidden"
        >
          {/* Image - responsive sizing with Next.js Image */}
          <div className="relative w-full h-64 md:h-48 md:w-48 flex-shrink-0">
            <Image
              src={member.singleImage || '/default-avatar.jpg'}
              alt={`Portrait of ${member.title}`}
              fill
              className="object-cover md:rounded-s-lg rounded-t-lg md:rounded-tr-none transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            />
            {/* Badge for showWebsite status */}
            {member.showWebsite && (
              <span className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                Featured
              </span>
            )}
          </div>
        
          {/* Content */}
          <div className="flex flex-col justify-between p-5 w-full">
            <div>
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-1">
                {member.title}
              </h5>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 line-clamp-2">
                {member.designation}
              </p>
            </div>
            
            {/* Additional metadata */}
            <div className="flex items-center justify-between mt-4 text-sm">
             
              {/* Social links */}
              {/* <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1 text-gray-500 hover:text-blue-500 dark:hover:text-blue-400">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </button>
                <button className="p-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </button>
              </div> */}
            </div>
          </div>
        </a>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default TeamMember