import React from "react";

export default function PostPagination({ page, setPage, postCount }) {
  let totalPages;
  const pagination = () => {
    totalPages = Math.ceil(postCount && postCount.totalPosts / 6);
    if (totalPages > 10) totalPages = 10;

    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <li>
          <a
            className={`page-link ${page === i && "activePagination"}`}
            onClick={() => setPage(i)}
          >
            {i}
          </a>
        </li>
      );
    }
    return pages;
  };
  return (
    <div>
      <nav>
        <ul className="pagination justify-content-center">
          <li>
            <a
              className={`page-link ${page === 1 && "disabled"}`}
              onClick={() => setPage(1)}
            >
              Prev
            </a>
          </li>
          {pagination()}
          <li>
            <a
              className={`page-link ${page === totalPages && "disabled"}`}
              onClick={() => setPage(totalPages)}
            >
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
