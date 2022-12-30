import styled from 'styled-components';

export const Container = styled.div`
    .map {
        // width: 100%;
        height: 250px;
    }
    .re-bounds{
        position: absolute;
        z-index: 1;
        right: 24px;
        top: 12px;
        width: 28px;
        height: 28px;  
      }

     .geofence-outter {
        position: relative;
        margin-top: 15px;
        border: 1px solid #ddd;
    }
      
    .geofence-locations-wrapper{
        height: 250px;
        background: #fff;
        overflow-y: auto;
        padding: 15px 10px;
        cursor: pointer;
    }
    .geofence-locations {
        position: relative;
        margin: 10px 0;

        h5{
            font-weight:700;
            font-size:14px;
        }

        
        .MuiSvgIcon-root {
            position: absolute;
            right: 10px;
            top: 0px;
            font-size: 18px;
            color: #848484;
        }
        
        hr {
            margin: 10px 0;
        }
    }
    .geofence-search-location{
        .MuiInputBase-input{
            padding:2px !important;
        }
    }
    .geofence-slider {
        margin-top: 15px;

        .MuiFormLabel-root {
            font-size: 12px;
        }

        .MuiSlider-root {
            margin: 0 7px;
            padding: 0;
        }

        p {
            text-align: center;
            color: rgba(0, 0, 0, 0.54);
            font-size: 13px;
        }
    }
    .review-campaign-disabled {
        pointer-events: none !important;
    }
`;