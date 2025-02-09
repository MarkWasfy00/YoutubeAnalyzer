import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store';
import { sendYoutubeLinks } from '../../features/youtubeList/youtubeListSlice';
import styles from './Pagination.module.scss';


const Pagination = ({ itemsPerPage }) => {
    const dispatch = useDispatch<AppDispatch>();
    const items = useSelector((state: RootState) => state.youtubeList.list);
    
    const [itemOffset, setItemOffset] = useState(0);

    // Ensure there are items before computing pagination
    const pageCount = items.length > 0 ? Math.ceil(items.length / itemsPerPage) : 1;
    
    // Fetch new set of items when itemOffset changes
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
            />
        </>
    );
};

export default Pagination;
