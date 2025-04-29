"use client";
import { useState, useEffect, useRef } from "react";

interface InstagramPost {
  _id: string;
  instagramLink: string;
  createdAt: string;
}

interface ApiResponse {
  products: InstagramPost[];
  totalPages: number;
  currentPage: number;
}

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

const InstaPost = () => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Load Instagram script only once
  const scriptLoaded = useRef(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `http://localhost:8000/admin/instagram-post?page=${page}&limit=8`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data: ApiResponse = await res.json();
        setPosts(data.products);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  useEffect(() => {
    // Load Instagram embed script once
    const loadInstagramScript = () => {
      if (!scriptLoaded.current && !window.instgrm) {
        const script = document.createElement("script");
        script.src = "https://www.instagram.com/embed.js";
        script.async = true;
        script.onload = () => {
          window.instgrm?.Embeds.process();
        };
        document.body.appendChild(script);
        scriptLoaded.current = true;
      } else {
        window.instgrm?.Embeds.process();
      }
    };

    if (posts.length > 0) {
      loadInstagramScript();
    }
  }, [posts]);

  const extractInstagramId = (link: string): string | null => {
    try {
      const cleanUrl = link.split("?")[0];
      const parts = cleanUrl.split("/");
      const index = parts.findIndex((p) => p === "reel");

      if (index !== -1 && parts[index + 1]) {
        return parts[index + 1];
      }

      return null;
    } catch (error) {
      console.error("Error extracting Instagram ID:", error);
      return null;
    }
  };

  if (loading) return <div className="text-center py-10">Loading posts...</div>;
  if (error)
    return <div className="text-center text-red-500 py-10">Error: {error}</div>;

  return (
    <div className="px-4 py-8 max-w-screen-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {posts.map((post) => {
          const postId = extractInstagramId(post.instagramLink);

          if (!postId) {
            return (
              <div
                key={post._id}
                className="w-full mb-4 p-4 bg-red-50 border border-red-200 rounded"
              >
                <p className="text-red-600">
                  Invalid Instagram URL: {post.instagramLink}
                </p>
              </div>
            );
          }

          return (
            <div key={post._id} className="w-full mb-4 min-h-[400px]">
              <blockquote
                className="instagram-media"
                data-instgrm-permalink={`https://www.instagram.com/reel/${postId}/`}
                data-instgrm-version="14"
                style={{
                  background: "#FFF",
                  border: "0",
                  borderRadius: "3px",
                  boxShadow:
                    "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
                  margin: "1px",
                  maxWidth: "540px",
                  minWidth: "326px",
                  padding: "0",
                  width: "calc(100% - 2px)",
                }}
              >
                <div style={{ padding: "16px" }}>
                  <a
                    href={`https://www.instagram.com/reel/${postId}/`}
                    style={{
                      background: "#FFFFFF",
                      lineHeight: "0",
                      padding: "0 0",
                      textAlign: "center",
                      textDecoration: "none",
                      width: "100%",
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Loading Instagram Reel...
                  </a>
                </div>
              </blockquote>
            </div>
          );
        })}
      </div>

      {/* Pagination controls */}
      <div className="col-span-full flex justify-end items-center gap-4 mt-10 font-montserrat">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded ${
            page === 1 ? "" : " text-white hover:bg-blue-600"
          }`}
        >
          Previous
        </button>
        <span className="text-sm">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className={`px-4 py-2 rounded ${
            page === totalPages
              ? ""
              : " text-white hover:bg-blue-600"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default InstaPost;
