import React, { memo } from "react";

// global utils
import { userHasPermission } from "@dr-one/utils";

// material
import { Grid } from '@material-ui/core'

// utils/const
import {ANALYTICS_PERMISSION } from './const'

interface Props {
    children: React.ReactNode;
}
  

export default function AnalyticsPermission(props: Props) {
    const hasPermission: boolean = userHasPermission(ANALYTICS_PERMISSION)

    if (!hasPermission) {
        return (
            <Grid container>
                <Grid item xs={12}>
                    You do not have permissions for this section.
                </Grid>
            </Grid>
        )
    }

    return <React.Fragment>
        {
            props.children
        }
    </React.Fragment>
}

