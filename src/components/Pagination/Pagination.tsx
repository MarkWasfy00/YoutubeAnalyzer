import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store';
import { sendYoutubeLinks } from '../../features/youtubeList/youtubeListSlice';
import styles from './Pagination.module.scss';

const Pagination = ({ itemsPerPage }) => {
    const dispatch = useDispatch<AppDispatch>();
    const items = useSelector((state: RootState) => state.youtubeList.list);
    
    const [itemOffset, setItemOffset] = useState(0);
    const [forcePage, setForcePage] = useState(0); // Add state to force ReactPaginate to a specific page

    // Ensure there are items before computing pagination
    const pageCount = items.length > 0 ? Math.ceil(items.length / itemsPerPage) : 1;
    
    // Reset itemOffset and force ReactPaginate to page 1 when items change
    useEffect(() => {
        setItemOffset(0); // Reset offset to 0 (first page)
        setForcePage(0); // Force ReactPaginate to display page 1
    }, [items]);

    // Fetch new set of items when itemOffset or items change
    useEffect(() => {
        if (items.length > 0) {
            const endOffset = itemOffset + itemsPerPage;
            dispatch(sendYoutubeLinks(items.slice(itemOffset, endOffset)));
        }
    }, [itemOffset, items, itemsPerPage, dispatch]);

    // Handle page click event
    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % items.length;
        setItemOffset(newOffset);
        setForcePage(event.selected); // Update the forced page to the selected page
    };

    return (
        <>
            <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="<"
                marginPagesDisplayed={0}
                renderOnZeroPageCount={null}
                containerClassName={styles.pagination}
                activeClassName={styles.selected}
                disabledClassName={styles.disabled}
                breakClassName={styles.break}
                forcePage={forcePage} // Force ReactPaginate to display the specified page
            />
        </>
    );
};

export default Pagination;