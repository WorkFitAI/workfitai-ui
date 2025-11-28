type PaginationProps = {
  prev: () => void;
  next: () => void;
  currentPage: number;
  pages: number;
  getPaginationGroup: number[];
  handleActive: (page: number) => void;
};

export default function Pagination({
  prev,
  currentPage,
  getPaginationGroup,
  next,
  pages,
  handleActive,
}: PaginationProps) {
  const hasPagination = getPaginationGroup.length > 0;

  return (
    <ul className="pager">
      {hasPagination && (
        <li onClick={prev}>
          {currentPage === 1 ? null : <a className="pager-prev" />}
        </li>
      )}

      {getPaginationGroup.map((item) => (
        <li onClick={() => handleActive(item)} key={item}>
          <a
            className={
              currentPage === item ? "page-number active" : "page-number"
            }
          >
            {item}
          </a>
        </li>
      ))}

      {hasPagination && (
        <li onClick={next}>
          {currentPage >= pages ? null : <a className="pager-next" />}
        </li>
      )}
    </ul>
  );
}
