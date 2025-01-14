import { Grid } from '@mui/material';

import { DisplayType as DisplayTypeEnum } from '../models';

import DisplayType from './DisplayType';
import ResourceActions from './ResourceActions';

interface Props {
  displayType: DisplayTypeEnum;
  hasMetaService: boolean;
  setPanelOptions: (panelOptions) => void;
}

const Actions = ({
  displayType,
  setPanelOptions,
  hasMetaService
}: Props): JSX.Element => {
  return (
    <Grid container>
      <Grid item flex={1}>
        <ResourceActions />
      </Grid>
      <Grid item flex={1}>
        <DisplayType
          displayType={displayType}
          hasMetaService={hasMetaService}
          setPanelOptions={setPanelOptions}
        />
      </Grid>
    </Grid>
  );
};

export default Actions;
