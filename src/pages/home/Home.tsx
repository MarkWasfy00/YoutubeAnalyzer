import styles from './Home.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretLeft, faCaretRight, faCloudArrowDown, faEye, faFloppyDisk, faRefresh, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useRef, useState } from 'react'
import { AppDispatch, RootState } from '../../app/store'
import { useDispatch, useSelector } from 'react-redux'
import { deleteSavedDiagramData, deleteTagsFromDiagram, getDiagramData, getSavedDiagramData, saveDiagramData } from '../../features/diagram/diagramSlice'
import { faYoutube } from '@fortawesome/free-brands-svg-icons'
import { fetchSavedList } from '../../features/savedDiagram/savedDiagramSlice'
import { gsap } from "gsap"
import { NewCirclePackingChart } from '../../components/newCirclePacking/NewCirclePacking'
import Pagination from '../../components/Pagination/Pagination'
import { isExpanded } from '../../features/youtubeList/youtubeListSlice'
import { useNavigate } from 'react-router-dom'
import { isTokenExpired } from '../../utils/utils'
import { logout } from '../../features/auth/authSlice'



const Home = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [isLoading, setIsLoading] = useState(false)
    const [isDiagramSaved, setIsDiagramSaved] = useState(false)
    const [isLoadedSuccesfully, setIsLoadedSuccesfully] = useState(false)
    // const [isExpanded, setIsExpanded] = useState(false)
    const [searchBar, setSearchBar] = useState("")
    const [excludeBar, setExcludeBar] = useState("")
    const barRef = useRef<HTMLInputElement>(null);



    const navigate = useNavigate(); // Initialize useNavigate
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);

    // Redirect to /login if user is not authenticated
    useEffect(() => {
        if (!accessToken || isTokenExpired(accessToken)) {
            dispatch(logout()); // Clear Redux state and localStorage
            navigate("/login"); // Redirect to login page
          }
    }, [accessToken, dispatch, navigate]);

    const [saved, setSaved] = useState("1")

    const diagram = useSelector((state: RootState) => state.diagram);

    const savedDiagramList = useSelector((state: RootState) => state.savedDiagram.saved);


    const list = useSelector((state: RootState) => state.youtubeList.list);
    const youtubeList = useSelector((state: RootState) => state.youtubeList.youtubeInfo);
    const isLoadingYoutubeList = useSelector((state: RootState) => state.youtubeList.loading);
    const youtubeBar = useSelector((state: RootState) => state.youtubeList.isExpanded);

    const searchForYoutubeChannel = async (value: string) => {
        if (value) {
            setIsLoading(true); 
            try {
                await dispatch(getDiagramData({ payload: value })).unwrap();
            } catch {
                setIsLoadedSuccesfully(true)
                setTimeout(() => {
                    setIsLoadedSuccesfully(false)
                }, 4000)
            } finally {
                setIsLoading(false);
            }
        }
    };

    const fetchSavedYoutubeLists = async () => {
            setIsLoading(true);
            try {
                await dispatch(fetchSavedList());
            } catch (error) {
                console.error('Error fetching data:', error); 
            } finally {
                setSaved("1")
                setIsLoading(false);
            }
    }

    const saveDiagram = async () => {
        if ((diagram.children?.length ?? 0) >= 1) {
            setIsLoading(true);
            try {
                await dispatch(saveDiagramData({ payload: { ...diagram } }));
            } catch (error) {
                console.error('Error fetching data:', error); 
            } finally {
                setIsLoading(false);
                setIsDiagramSaved(true)
                fetchSavedYoutubeLists()
                setTimeout(() => {
                    setIsDiagramSaved(false)
                }, 3000)
            }
        }
    }

    const loadSavedDiagram = async () => {
        if (saved) {
            setIsLoading(true);
            try {
                await dispatch(getSavedDiagramData({ payload: saved }));
            } catch (error) {
                console.error('Error fetching data:', error); 
            } finally {
                setIsLoading(false);
            }
        }
    }

    const excludeTagsFromDiagram = async () => {
        if (saved) {
            setIsLoading(true);
            try {
                await dispatch(deleteTagsFromDiagram({ payload: {  ...diagram, tags_to_delete: excludeBar.split(",") } }));
            } catch (error) {
                console.error('Error fetching data:', error); 
            } finally {
                setIsLoading(false);
            }
        }
    }

    const deleteSavedDiagram = async () => {
        if (saved) {
            try {
                await dispatch(deleteSavedDiagramData({ payload: saved }));
            } catch (error) {
                console.error('Error fetching data:', error); 
            } finally {
                setIsLoading(false);
                fetchSavedYoutubeLists()
                setSaved("1")
            }
        }
    }

    const formatNumberWithSymbol = (num: number): string =>  {
        if (num >= 1000000) {
            const value = (num / 1000000).toFixed(1);
            return value.endsWith('.0') ? `${value.slice(0, -2)}M` : `${value}M`;
        } else if (num >= 1000) {
            const value = (num / 1000).toFixed(1);
            return value.endsWith('.0') ? `${value.slice(0, -2)}K` : `${value}K`;
        } else {
            return num.toString();
        }
    }

    const collapse = () => {
        gsap.to(barRef.current, { right: "-49rem" })
        dispatch(isExpanded(false));
    }

    const expand = () => {
        gsap.to(barRef.current, { right: "0" })
        dispatch(isExpanded(true));
    }

    useEffect(() => {
        if (youtubeBar) {
            gsap.to(barRef.current, { right: "0" })
        } else {
            gsap.to(barRef.current, { right: "-49rem" })
        }
    },[youtubeBar])


    useEffect(() => {
        fetchSavedYoutubeLists()
    }, [])

    const handleSearch = () => {

        if (searchBar) {
            searchForYoutubeChannel(searchBar)
        }
    };

    const searchChange = (value: string) => {
        setSearchBar(value)
    }

  return (
    <main className={styles.main}>
        <div className={styles.search}>
            {/* <div className={styles.yt}>
                <FontAwesomeIcon  icon={faYoutube} />
            </div> */}
            <input type="text" onChange={(e) => searchChange(e.target.value)} className={styles.searcher} placeholder="Youtube Channel" />
            <button className={isLoading ? `${styles.icon} ${styles.loader}` : styles.icon} disabled={isLoading} onClick={handleSearch}>
                {
                    isLoading ? (
                        <div className={styles.btnload}></div>
                    ) : (
                        <FontAwesomeIcon  icon={faYoutube} />
                    )
                }
            </button>
        </div>
        <div className={styles.container}>

            <div className={styles.diagram}>
                <div className={styles.circle}>
                    {
                        isLoading ? (
                            <div className={styles.loading}></div>
                        ): (diagram.children?.length ?? 0) >= 1 ? (
                            <>
                                <NewCirclePackingChart data={diagram} />
                                {
                                    isLoadedSuccesfully ? <div className={styles.notfound}>Channel Not Found !!</div> : null
                                }
                            </>
                        ) : (
                            <div className={styles.nodata}>Please Search...</div>
                        )
                    }
                </div>
                <div className={styles.buttons}>
                    <button className={styles.btn} disabled={isLoading} onClick={saveDiagram}>Save <FontAwesomeIcon  icon={faFloppyDisk} /></button>
                    <button className={styles.btn} disabled style={{ cursor: "not-allowed" }}>Download <FontAwesomeIcon  icon={faCloudArrowDown} /></button>
                </div> {  isDiagramSaved ? <p className={styles.saved}>Saved Succesfully</p>: null }
            </div>
            <div ref={barRef} className={styles.bar}>
                <div className={styles.collapse}>
                  {
                    youtubeBar ? (
                        <div className={styles.box} onClick={collapse}> <FontAwesomeIcon  icon={faCaretRight} /></div>
                    ) : (
                        <div className={styles.box} onClick={expand}> <FontAwesomeIcon  icon={faCaretLeft} /></div>
                    )
                  }
                </div>
                <div className={styles.saved}>
                    <div className={styles.refresh} onClick={fetchSavedYoutubeLists}>
                        <FontAwesomeIcon  icon={faRefresh} />
                    </div>
                    <div className={styles.select}>
                        <select 
                            className={styles.input} 
                            value={saved}
                            onChange={(e) => setSaved(e.target.value)} // Handle the change at the <select> level
                            // defaultValue="1"
                        >
                            <option defaultChecked disabled value="1">Select Saved Diagram</option>
                            {
                                savedDiagramList.map(dataName => (
                                    <option key={dataName} value={dataName}>{dataName}</option> // Just set the value here
                                ))
                            }
                        </select>
                    </div>
                    <button className={styles.load} onClick={loadSavedDiagram}>Load</button>
                    <button className={styles.load} onClick={deleteSavedDiagram}>Delete</button>
                </div>
                <div className={styles.vids}>
                    {
                        list.length >= 1 ? (
                            <>
                                
                                {
                                    youtubeList.map(video => (
                                        <div key={video.video_id}>
                                            { isLoadingYoutubeList ? <div className={styles.youtubeloader}></div>: null }
                                            <a className={styles.video} target='_blank' href={`https://www.youtube.com/watch?v=${video.video_id}`}>
                                                <div className={styles.thumbnail}>
                                                    <img src={video.thumbnail} alt="thumbnail" />
                                                </div>
                                                <div className={styles.info}>
                                                    <div className={styles.title}>{video.title}</div>
                                                    <div className={styles.views}><FontAwesomeIcon  icon={faEye} /> {formatNumberWithSymbol(video.views)}</div>
                                                    <div className={styles.likes}><FontAwesomeIcon  icon={faThumbsUp} /> {formatNumberWithSymbol(video.likes)}</div>
                                                    {/* <div className={styles.icon}>
                                                        <FontAwesomeIcon  icon={faLink} />
                                                    </div> */}
                                                </div>
                                                {/* <iframe className={styles.iframe} id="ytplayer" width="100%" height="360"
                                                    src={`https://www.youtube.com/embed/${video}?autoplay=1&origin=http://localhost:5173`}
                                                    frameBorder="0">
                                                </iframe> */}
                                            </a>
                                        </div>
                                    ))
                                }
                                <div className={styles.pagination}>
                                    <Pagination itemsPerPage={10} />
                                </div>
                            </>
                        ) : <div className={styles.novideos}>Please Select dataset from diagram to load</div>
                    }

                </div>
                <div className={styles.filter}>
                    <input className={styles.input} value={excludeBar} onChange={(e) => setExcludeBar(e.target.value)} placeholder='Exclude tags with ,' type="text" />
                    <button onClick={excludeTagsFromDiagram} className={styles.filterbtn}>
                        Exclude
                    </button>
                </div>
                
            </div>
        </div>
    </main>
  )
}

export default Home