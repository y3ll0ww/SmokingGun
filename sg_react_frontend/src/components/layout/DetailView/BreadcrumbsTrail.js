import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Stack, Breadcrumbs } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import store from '../Redux/store';
import useRequestResource from '../../../hooks/useRequestResource';
import * as actions from '../Redux/actionTypes';
import { PROJECT, FOLDER, TESTCASE, KEY_, TRUNCATE, PRIMARY_COLOR } from '../../constants';

export default function BreadcrumbsTrail(props) {
    const type = useSelector(state => state.type);
    const object = useSelector(state => state.object);
    const project = useSelector(state => state.projects.currentProject);
    const [trail, setTrail] = useState([]);

    useEffect(() => {
        if (type === FOLDER || type === TESTCASE) {
            fetch(`/api/suite/breadcrumbs/${type}/${object.id}/`)
              .then((response) => response.json())
              .then((data) => {
                const trail = data.map((item) => {
                    return (
                        <Button
                            underline='hover'
                            key={`F${item.id}`}
                            color='inherit'
                            onClick={() => handleFolderClick(item.id)}
                            style={{ textTransform: 'none' }}
                        >
                            {<span style={{ color: 'silver', fontSize: '10px' }}>{KEY_(project.key, item.item_number)}</span>}&nbsp;{TRUNCATE(item.name, 20)}
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
                            <HomeIcon style={{ color: PRIMARY_COLOR }}/>
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
        } else if (type === PROJECT) {
            const trail = [];
            trail.unshift(
                <Button
                    disabled
                    underline='hover'
                    key='home'
                    color='inherit'
                    style={{ minWidth: '32px' }}>
                        <HomeIcon />
                </Button>
            );
            setTrail(trail);
        }
    }, [type, object.id]);

    const { getResource: getFolderResource, resource: folderResource } = useRequestResource({ endpoint: `/suite/${FOLDER}` });

    const handleFolderClick = (id) => {
      store.dispatch({ type: actions.SELECTION, payload: [] });
      getFolderResource(id);
    };

    useEffect(() => {
      if (folderResource) {
        store.dispatch({ type: actions.GET_FOLDER, payload: folderResource });
      }
    }, [folderResource]);

    const { getResource: getRootResource, resource: rootResource } = useRequestResource({ endpoint: `/suite/${PROJECT}` });

    const handleRootClick = () => {
      getRootResource(project.id);
    };

    useEffect(() => {
      if (rootResource) {
        store.dispatch({ type: actions.GET_PROJECT, payload: rootResource }); // Set project in store
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