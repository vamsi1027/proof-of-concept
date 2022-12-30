import React, { useState, useContext, useEffect, useRef, useCallback } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    Avatar,
    FormControlLabel,
    Switch,
    Slider,
    TextField,
    Grid
} from "@material-ui/core";
import { Autocomplete } from '@material-ui/lab';
import { GlobalContext } from "../../../context/globalState";
import { useTranslation } from 'react-i18next';
import { GoogleMapsObject, helper } from '@dr-one/utils';
import { CAMPAIGN_ACTIONS } from "../../../context/CampaignFormReducer";
import * as S from "./GeofenceContainer.styles";
import ZoomOutMapSharpIcon from '@material-ui/icons/ZoomOutMapSharp';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';

const GeofenceContainer = () => {
    const { state } = useContext(GlobalContext);
    const { dispatch } = useContext(GlobalContext);
    const { t } = useTranslation();
    const [googleMaps, setGoogleMaps] = useState(Object);
    const maxLocation = 10;
    const [latLong, setLatLong] = useState({ lat: 32.9333771, lng: -96.8086829 })
    const [selectedLocalList, setSelectedLocalList] = useState(state.formValues.settings.geofence.locationList);
    const [markers, setMarkers] = useState([]);
    const [mapElem, setMapElem] = useState(null);
    const [searchPlace, setPlaceName] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchList, setSearchList] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedLocation, setLocation] = useState(Object);
    const [marker, setMarker] = useState(null);
    const [locationError, setLocationError] = useState(state.formValues.settings.geofence.locationError);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (state.formValues.settings.geofence.enableGeofence) {
            // replace icon for security reason
            setTimeout(() => {
                const plusNodeList = document.querySelectorAll("div.gm-style div div.gmnoprint.gm-bundled-control.gm-bundled-control-on-bottom div.gmnoprint div > button.gm-control-active:first-child img");
                const minusNodeList = document.querySelectorAll("div.gm-style div div.gmnoprint.gm-bundled-control.gm-bundled-control-on-bottom div.gmnoprint div button.gm-control-active:last-child img");
                plusNodeList.forEach((img, index) => {
                    img.setAttribute("src", `/icons/plus-${index + 1}.svg`);
                });
                minusNodeList.forEach((img, index) => {
                    img.setAttribute("src", `/icons/minus-${index + 1}.svg`);
                });
            }, 2000);
            GoogleMapsObject.googleMapInit().then((maps: any) => {
                setGoogleMaps(maps);
                const mapSearchCenter = new maps.LatLng(latLong.lat, latLong.lng);

                let mapEle = new maps.Map(ref.current, {
                    center: mapSearchCenter,
                    mapTypeControl: false,
                    streetViewControl: false,
                    rotateControl: false,
                    fullscreenControl: false,
                    zoom: 12
                });
                setMapElem(mapEle);

                selectedLocalList.map(loc => {
                    addMarker(loc, maps, mapEle);
                });
            })
            if (selectedLocalList && selectedLocalList.length > 0 && selectedLocalList.length <= maxLocation) {
                const modifiedPayload = Object.assign({}, state.formValues);
                modifiedPayload['settings']['isSettingSectionValid']['isGeofenceSectionValid'] = true;
                dispatch({
                    type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
                    payload: {
                        campaignPayload: modifiedPayload, currentPageName: 'settings',
                        campaignBreadCrumbList: state.campaignBreadCrumbList,
                        campaignStepsArray: state.campaignStepsArray
                    }
                })
            } else {
                const modifiedPayload = Object.assign({}, state.formValues);
                modifiedPayload['settings']['isSettingSectionValid']['isGeofenceSectionValid'] = false;
                dispatch({
                    type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
                    payload: {
                        campaignPayload: modifiedPayload, currentPageName: 'settings',
                        campaignBreadCrumbList: state.campaignBreadCrumbList,
                        campaignStepsArray: state.campaignStepsArray
                    }
                })
            }
        } else {
            const modifiedPayload = Object.assign({}, state.formValues);
            modifiedPayload['settings']['isSettingSectionValid']['isGeofenceSectionValid'] = true;
            dispatch({
                type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
                payload: {
                    campaignPayload: modifiedPayload, currentPageName: 'settings',
                    campaignBreadCrumbList: state.campaignBreadCrumbList,
                    campaignStepsArray: state.campaignStepsArray
                }
            })
        }

    }, [state.formValues.settings.geofence.enableGeofence])

    const addMarker = (loc, googleMapsValue = googleMaps, mapData = mapElem): void => {
        const marker = new googleMapsValue.Marker({
            position: { lat: loc.latitude, lng: loc.longitude },
            map: mapData,
            title: loc.formatted_address,
            icon: { url: '/img/marker.png', scaledSize: new googleMapsValue.Size(20, 32) }
        });
        markers.push(marker);
        setMarkers(markers);
        setMapCenter(marker, mapData);
        fitBoundsMap(markers, mapData, googleMapsValue);
    }

    const setMapCenter = (marker, mapData): void => {
        mapData.panTo(marker.getPosition());
    }

    const fitBoundsMap = (markersArray: any, mapItem = mapElem, googleMapsValue = googleMaps): void => {
        const bounds = new googleMapsValue.LatLngBounds();
        for (let i = 0; i < markersArray.length; i++) {
            bounds.extend(markersArray[i].getPosition());
        }
        mapItem.fitBounds(bounds);
    }

    const handleChangeSlider = (event, newValue): void => {
        const modifiedPayload = Object.assign({}, state.formValues);
        modifiedPayload['settings']['geofence']['geoRadius'] = newValue;
        dispatch({
            type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
            payload: {
                campaignPayload: modifiedPayload, currentPageName: 'settings',
                campaignBreadCrumbList: state.campaignBreadCrumbList,
                campaignStepsArray: state.campaignStepsArray
            }
        })
    }

    const callGooglePlaceApi = (request: any, placeName: string): void => {
        if (placeName && request) {
            const service = new googleMaps.places.PlacesService(mapElem);
            service.textSearch(request, response => {
                setLoading(false);

                setSearchList(response?.map(loc => {
                    return {
                        is_selected: false,
                        name: loc.name,
                        formatted_address: loc.formatted_address,
                        place_id: loc.place_id,
                        latitude: loc.geometry.location.lat(),
                        longitude: loc.geometry.location.lng()
                    };
                }));
            });
        }
    }

    const prepRequest = (placeName: string): any => {
        const request = {
            location: new googleMaps.LatLng(
                mapElem.getCenter().lat(),
                mapElem.getCenter().lng()
            ),
            radius: '500',
            query: placeName
        };

        return request;
    }


    const handleChangeLocationName = (placeName: string): void => {
        if (placeName?.length !== 0) {
            setLoading(true);
            callGooglePlaceApi(prepRequest(placeName), placeName);
        } else {
            setSearchList([]);
        }
    }

    const add = (loc: any): void => {
        let selectedPlaces;
        let errorText;
        selectedPlaces = [...selectedLocalList];
        if (selectedPlaces.length < maxLocation) {
            const searchListArray = searchList.map(l => {
                if (l.place_id === loc.place_id) {
                    l.is_selected = true;
                }
                return l;
            });
            setSearchList(searchListArray);
            if (selectedPlaces.length === 0) {
                selectedPlaces = [];
                selectedPlaces.push(loc);
                setSelectedLocalList(selectedPlaces);
            } else {
                if (selectedPlaces.filter(l => { if (l.place_id === loc.place_id) { return l; } }).length === 0) {
                    selectedPlaces.push(loc);
                    setSelectedLocalList(selectedPlaces);
                }
            }
            errorText = '';
        } else {
            errorText = t('SETTINGS_GEOFENCE_MAX_LOCATION_ERROR');
        }
        setLocationError(errorText);
        const modifiedPayload = Object.assign({}, state.formValues);
        modifiedPayload['settings']['geofence']['locationList'] = selectedPlaces;
        modifiedPayload['settings']['isSettingSectionValid']['isGeofenceSectionValid'] = true;
        modifiedPayload['settings']['geofence']['locationError'] = errorText;
        dispatch({
            type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
            payload: {
                campaignPayload: modifiedPayload, currentPageName: 'settings',
                campaignBreadCrumbList: state.campaignBreadCrumbList,
                campaignStepsArray: state.campaignStepsArray
            }
        })
        addMarker(loc);
    }

    const remove = (loc): void => {
        let errorText;
        const searchListArray = searchList.map(l => {
            if (loc.place_id === l.place_id) {
                l.is_selected = false;
            }
            return l;
        });
        setSearchList(searchListArray);
        let selectedPlaces = [...selectedLocalList];
        selectedPlaces = selectedLocalList.filter(l => {
            if (l.place_id !== loc.place_id) {
                return l;
            }
        });

        if (selectedPlaces.length <= maxLocation) {
            if (selectedPlaces.length === 0) {
                errorText = t('SETTINGS_GEOFENCE_REQUIRED_ERROR');
            } else {
                errorText = '';
            }
        }
        setSelectedLocalList(selectedPlaces);
        setLocationError(errorText);
        const modifiedPayload = Object.assign({}, state.formValues);
        modifiedPayload['settings']['geofence']['locationList'] = selectedPlaces;
        modifiedPayload['settings']['isSettingSectionValid']['isGeofenceSectionValid'] = (selectedPlaces.length <= maxLocation &&
            selectedPlaces.length > 0) ? true : false;
        modifiedPayload['settings']['geofence']['locationError'] = errorText;
        dispatch({
            type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
            payload: {
                campaignPayload: modifiedPayload, currentPageName: 'settings',
                campaignBreadCrumbList: state.campaignBreadCrumbList,
                campaignStepsArray: state.campaignStepsArray
            }
        })

        removeMarker(loc);
    }

    const removeMarker = (loc): void => {
        const markerArray = [...markers];
        markerArray.map((l, i) => {
            if (l.position.lat() === loc.latitude && l.position.lng() === loc.longitude) {
                markerArray[i].setMap(null);
            }
        });
        fitBoundsMap(markerArray);
    }

    const handleChangeGeofenceSwitch = (e: any): void => {
        const modifiedPayload = Object.assign({}, state.formValues);
        modifiedPayload['settings']['geofence']['enableGeofence'] = e.target.checked;
        dispatch({
            type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
            payload: {
                campaignPayload: modifiedPayload, currentPageName: 'settings',
                campaignBreadCrumbList: state.campaignBreadCrumbList,
                campaignStepsArray: state.campaignStepsArray
            }
        })
    }

    const zoomGeoLocation = (loc): void => {
        if (marker) {
            if (loc.latitude === marker[0].getPosition().lat() && loc.longitude === marker[0].getPosition().lng()) {
                fitBoundsMap(markers);
                setMarker(null);
            }
        }

        const markerArray = [...markers];
        let markerElem = JSON.parse(JSON.stringify(marker));
        markerElem = markerArray.filter((l, i) => {
            return (l.position.lat() === loc.latitude && l.position.lng() === loc.longitude);
        });
        setMarkers(markerArray);

        mapElem.panTo(markerArray[0].getPosition());
        mapElem.setZoom(12);
    }

    return (
        <S.Container>
            <Card variant="outlined">
                <CardHeader
                    avatar={
                        <Avatar aria-label="recipe">
                            {" "}
                            <img src={"/icons/location.svg"} alt="location" />
                        </Avatar>
                    }
                    title={t('SETTINGS_GEOFENCE_SECTION_HEADER')}
                />
                <CardContent>
                    <div className="message-switch-box">
                        <p>{t('SETTINGS_GEOFENCE_SWITCH_LABEL')}</p>
                        <div className="switch-inline">
                            <Grid className="switch-label-wrap switch-2-options mb-20" component="label" container alignItems="center">
                                <Grid item className="switch-label">
                                </Grid>
                                <Grid item className="no-padding">
                                    <div className="switchery">
                                        <FormControlLabel
                                            control={<Switch
                                                checked={state.formValues.settings.geofence.enableGeofence}
                                                onChange={handleChangeGeofenceSwitch}
                                                name="isCustom"
                                                disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                                            />}
                                            label={''}
                                        />
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                        <p>{t('SWITCH_ON')}</p>
                    </div>

                    {state.formValues.settings.geofence.enableGeofence && <div>
                        <Autocomplete
                            id="asynchronous-demo"
                            className="source-package-field"
                            open={open}
                            freeSolo
                            onOpen={() => {
                                setOpen(true);
                            }}
                            onClose={() => {
                                setOpen(false);
                            }}
                            filterOptions={x => x}
                            clearOnBlur={false}
                            getOptionLabel={(option) => option.name || ''}
                            renderOption={(option) => <div><strong>{option.name}</strong><small> {option.formatted_address}</small></div>}
                            options={searchList}
                            value={selectedLocation}
                            disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                            disableClearable
                            onChange={(e, newValue) => {
                                add(newValue);
                                setLocation({});
                            }}

                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                                    label={<div className="label-tooltip">{`${t('SETTINGS_GEOFENCE_TEXT_FIELD_LABEL')} *`}
                                        {/* <LightTooltip title={<label>{t('TOOLTIP_SRC_PACKAGE')}</label>} /> */}
                                    </div>}
                                    variant="outlined"
                                    onChange={(e) => {
                                        setPlaceName(e.target.value);
                                        handleChangeLocationName(e.currentTarget.value)
                                    }}
                                    className="geofence-search-location"
                                    placeholder={t('SETTINGS_GEOFENCE_TEXT_FIELD_PLACEHOLDER')}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    }}
                                />
                            )}
                        />
                        {loading && <p>{t('SEARCH_API_PROGRESS')}</p>}
                        <p className="error-wrap error">{locationError}</p>
                        {/* <ZoomOutMapSharpIcon onClick={() => fitBoundsMap(markers)} /> */}
                        <Grid container className="geofence-outter">
                            <div className="row">
                                {selectedLocalList?.length !== 0 &&
                                    <Grid item xs={12} sm={5} className="geofence-locations-wrapper">
                                        {
                                            selectedLocalList?.map((location, index) => (
                                                <div className={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus) ? "geofence-locations review-campaign-disabled" : "geofence-locations"} key={index} onClick={() => zoomGeoLocation(location)}>
                                                    <h5>{location.name}</h5>
                                                    <p>Lat: {location.latitude}, Lng: {location.longitude}</p>
                                                    <p>{location.formatted_address}</p>
                                                    <CloseOutlinedIcon onClick={() => remove(location)} />
                                                    <hr />
                                                </div>
                                            ))
                                        }
                                    </Grid>}
                                <Grid item xs={12} sm={(selectedLocalList?.length !== 0) ? 7 : 12} ref={ref} className="map">
                                </Grid>
                            </div>
                        </Grid>

                        <div className="geofence-slider">
                            <label className="MuiFormLabel-root" style={{ fontSize: 12 }}>
                                <div className="label-tooltip small-tooltip">{`${t('SETINGS_GEOFENCE_GEO_RADIUS_LABEL')} *`}
                                    {/* <LightTooltip title={<label>{t('ADMIN_SETTING_CAMPAIGN_DELIVERY_WINDOW_TOOLTIP')}</label>}
                                    /> */}
                                </div>
                            </label>
                            <Slider
                                value={state.formValues.settings.geofence.geoRadius}
                                min={100}
                                step={100}
                                max={1000}
                                onChange={handleChangeSlider}
                                valueLabelDisplay="auto"
                                aria-labelledby="non-linear-slider"
                                disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                            />
                            <p>{state.formValues.settings.geofence.geoRadius} {t('SETINGS_GEOFENCE_GEO_RADIUS_UNIT')}</p>
                        </div>
                    </div>}

                </CardContent>
            </Card>
        </S.Container>

    );
};

export default GeofenceContainer;
