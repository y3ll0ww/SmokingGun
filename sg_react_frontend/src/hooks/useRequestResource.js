import { useCallback, useState, useContext } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";

import formatHttpApiError from "../helpers/formatHttpApiError";
import { LoadingOverlayResourceContext } from "../components/LoadingOverlayResource";
import getCommonOptions from "../helpers/axios/getCommonOptions";

export default function useRequestResource({ endpoint, resourceLabel }) {
    const [resourceList, setResourceList] = useState({
        results: []
    });
    const [resource, setResource] = useState(null);
    const [error, setError] = useState(null);
    const { enqueueSnackbar } = useSnackbar();
    const loadingOverlay = useContext(LoadingOverlayResourceContext);
    const { setLoading } = loadingOverlay;

    const handleRequestResourceError = useCallback((err) => {
        const formattedError = formatHttpApiError(err);
        setError(formattedError);
        setLoading(false);
        enqueueSnackbar(formattedError);
        if (err.response && err.response.status === 404) {
            setResource(err.response)
        }
    }, [enqueueSnackbar, setError, setLoading])

    const getResourceList = useCallback(() => {
        setLoading(true);
        axios.get(`/api/${endpoint}/`, getCommonOptions())
            .then((res) => {
                setLoading(false);
                setResourceList({
                    results: res.data
                })
            }).catch(handleRequestResourceError)
    }, [endpoint, handleRequestResourceError, setLoading])

    const addResource = useCallback((values, successCallback) => {
        setLoading(true);
        axios.post(`/api/${endpoint}/`, values, getCommonOptions())
            .then(() => {
                setLoading(false);
                enqueueSnackbar(`${resourceLabel} is added`)
                if (successCallback) {
                    successCallback();
                }
            }).catch(handleRequestResourceError)
    }, [endpoint, enqueueSnackbar, resourceLabel, handleRequestResourceError, setLoading])

      const getResource = useCallback((id = '') => {
        setLoading(true);
        const url = id ? `/api/${endpoint}/${id}/` : `/api/${endpoint}/`;
    
        axios.get(url, getCommonOptions())
            .then((res) => {
                setLoading(false);
                const { data } = res;
                setResource(data);
            })
            .catch(handleRequestResourceError);
    }, [endpoint, handleRequestResourceError, setLoading]);

    const updateResource = useCallback((id, values, successCallback) => {
        setLoading(true);
        axios.patch(`/api/${endpoint}/${id}/`, values, getCommonOptions())
            .then(() => {
                setLoading(false);
                enqueueSnackbar(`${resourceLabel} updated`)
                if (successCallback) {
                    successCallback();
                }
            }).catch(handleRequestResourceError)
    }, [endpoint, enqueueSnackbar, resourceLabel, handleRequestResourceError, setLoading])

    const deleteResource = useCallback((id) => {
        setLoading(true);
        axios.delete(`/api/${endpoint}/${id}/`, getCommonOptions())
            .then(() => {
                setLoading(false);
                enqueueSnackbar(`"${resourceLabel}" is deleted`)
                const newResourceList = {
                    results: resourceList.results.filter((r) => {
                        return r.id !== id
                    })
                }
                setResourceList(newResourceList);
            }).catch(handleRequestResourceError)
    }, [endpoint, resourceList, enqueueSnackbar, resourceLabel, handleRequestResourceError, setLoading])

    const updateOrder = useCallback((ids, orders, successCallback) => {
        setLoading(true);
        const data = {
          ids: ids,
          orders: orders
        };
        console.log(data);
        axios.put(`/api/${endpoint}`, data, getCommonOptions())
          .then(() => {
            setLoading(false);
            enqueueSnackbar(`Order of ${resourceLabel} updated`);
            if (successCallback) {
              successCallback();
            }
          })
          .catch(handleRequestResourceError);
      }, [endpoint, enqueueSnackbar, handleRequestResourceError, setLoading]);

    return {
        resourceList,
        getResourceList,
        addResource,
        resource,
        getResource,
        updateResource,
        deleteResource,
        updateOrder,
        error
    }
}