// import { withStyles } from "@material-ui/core/styles";
import MaterialTooltip from "@material-ui/core/Tooltip";
import HelpOutline from '@material-ui/icons/HelpOutline';
// import { Colors } from '@dr-one/utils';

// const LightTooltip = withStyles(theme => ({
//     // tooltip: {
//     //     backgroundColor: `${Colors.HEADERCOLOR}`,
//     //     fontSize: 11,
//     // },
//     // arrow: {
//     //     color: `${Colors.HEADERCOLOR}`
//     // }
// }), { index: 1 })(MaterialTooltip)

const MainTooltips = (props) => {
    return (
        <MaterialTooltip
            arrow
            interactive
            PopperProps={{
                modifiers: {
                    offset: {
                        enabled: true,
                        offset: "0px, -10px"
                    }
                }
            }}
            title={props.title.props.children}
        >
            <span className="tooltip-icons" >
                <HelpOutline fontSize='small' />
            </span>
        </MaterialTooltip>
    )
}
export default MainTooltips

