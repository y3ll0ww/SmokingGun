import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Stack, Breadcrumbs } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import store from '../Redux/store';
import useRequestResource from '../../../hooks/useRequestResource';
import * as actions from '../Redux/actionTypes';
import { ROOT, FOLDER, TESTCASE, KEY_FOLDER } from '../../constants';

export default function BreadcrumbsTrail(props) {
    const type = useSelector(state => state.type);
    const object = useSelector(state => state.object);
    const [trail, setTrail] = useState([]);

    useEffect(() => {
        if (type === FOLDER || type === TESTCASE) {
            fetch(`/api/suite/breadcrumbs/${type}/${object.id}/`)
              .then((response) => response.json())
              .then((data) => {
                const trail = data.map((item) => {
                    const truncatedName = item.name.length > 20 ? `${item.name.slice(0, 17)}...` : item.name;
                    return (
                        <Button
                            underline='hover'
                            key={`F${item.id}`}
                            color='inherit'
                            onClick={() => handleFolderClick(item.id)}
                            style={{ textTransform: 'none' }}
                        >
                            {<span style={{ color: 'silver', fontSize: '10px' }}>{KEY_FOLDER(item.id)}</span>}&nbsp;{truncatedName}
                        </Button>
                    );
                });

                trail.unshift(
                    <Button
                        underline='hover'
                        key='home'
                        color='inherit'
                        onClick={handleRootClick}
                        style={{ minWidth: '32px' }}>
                            <HomeIcon />
                    </Button>
                );

                if (trail.length > 1) {
                    trail.pop();
                }

                setTrail(trail);
              })
              .catch((error) => {
                console.error('Error:', error);
              });
        } else if (type === ROOT) {
            const trail = [];
            trail.unshift(
                <Button
                    underline='hover'
                    key='home'
                    color='inherit'
                    onClick={handleRootClick}
                    style={{ minWidth: '32px' }}>
                        <HomeIcon />
                </Button>
            );
            setTrail(trail);
        }
    }, [type, object]);

    const { getResource: getFolderResource, resource: folderResource } = useRequestResource({ endpoint: '/suite/folder' });

    const handleFolderClick = (id) => {
      getFolderResource(id);
    };

    useEffect(() => {
      if (folderResource) {
        store.dispatch({ type: actions.GET_FOLDER, payload: folderResource });
      }
    }, [folderResource]);

    const { getResource: getRootResource, resource: rootResource } = useRequestResource({ endpoint: '/suite/root/' });

    const handleRootClick = () => {
      getRootResource();
    };

    useEffect(() => {
      if (rootResource) {
        store.dispatch({ type: actions.GET_ROOT, payload: rootResource });
      }
    }, [rootResource]);

    return (
        <Stack spacing={2}>
            <Breadcrumbs maxItems={4} separator="›" aria-label="breadcrumb">
                {trail}
            </Breadcrumbs>
        </Stack>
    );
}