import { ResponsiveCirclePacking } from '@nivo/circle-packing'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setList, setLoading, unsetList } from '../../features/youtubeList/youtubeListSlice';
import { DiagramState } from '../../features/diagram/diagramSlice';

// make sure parent container has a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.

interface CirclePackingProps {
    data: DiagramState
}


export const CirclePacking = ({ data }: CirclePackingProps) => {
    const [zoomedId, setZoomedId] = useState<string | null>(null);
    const [zoomedDepthId, setZoomedDepthId] = useState<number>(0);
    const dispatch = useDispatch();

    
    return (
        <ResponsiveCirclePacking
            data={data}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            id="id"
            value="value"
            colors={{ scheme: 'purple_orange' }}
            
            theme={{
                labels: {
                    text: {
                        fontSize: 12, // Adjust text size
                        fontFamily: 'Readex Pro', // Customize font
                        fontWeight: 'bold', // Optional font weight
                    },
                    
                },
            }}
            childColor={{
                from: 'color',
                modifiers: [
                    [
                        'brighter',
                        0.4
                    ]
                ]
            }}
            padding={4}
            enableLabels={true}
            labelsFilter={n => ((zoomedDepthId + 1) === n.node.depth) || (zoomedDepthId === n.node.depth) }  // Show labels for depth 2, adjust as needed
            labelsSkipRadius={10}  // Skip small nodes
            labelTextColor="#ffffff"
            borderWidth={3}
            borderColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        0.7
                    ]
                ]
            }}
            defs={[
                {
                    id: 'lines',
                    type: 'patternLines',
                    background: 'none',
                    color: 'inherit',
                    rotation: -45,
                    lineWidth: 5,
                    spacing: 8
                }
            ]}
            zoomedId={zoomedId}
            motionConfig="slow"
            onClick={(node) => {
                setZoomedId(zoomedId === node.id ? null : node.id);
                setZoomedDepthId(node.depth)
                dispatch(setLoading(true))
                if (node.data.videos_id) {
                    console.log(node.data);
                    dispatch(setList(node.data.videos_id));
                } else {
                    dispatch(unsetList());
                }
                setTimeout(() => {
                    dispatch(setLoading(false))
                }, 1000)
            }}
            // fill={[
            //     {
            //         match: {
            //             depth: 1
            //         },
            //         id: 'lines'
            //     }
            // ]}
            // Customize label rendering
            label={node => node.data.name}  
        />
    )
}
