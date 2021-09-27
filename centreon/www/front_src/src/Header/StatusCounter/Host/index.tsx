/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';

import classnames from 'classnames';
import * as yup from 'yup';
import numeral from 'numeral';
import { Link } from 'react-router-dom';
import { useTranslation, withTranslation } from 'react-i18next';

import HostIcon from '@material-ui/icons/Dns';

import {
  IconHeader,
  IconNumber,
  IconToggleSubmenu,
  SubmenuHeader,
  SubmenuItem,
  SubmenuItems,
} from '@centreon/ui';
import { useUserContext } from '@centreon/ui-context';

import styles from '../../header.scss';
import {
  getHostResourcesUrl,
  downCriterias,
  unreachableCriterias,
  upCriterias,
  pendingCriterias,
  unhandledStateCriterias,
} from '../getResourcesUrl';
import StatusCounter, { useStyles } from '..';

const hostStatusEndpoint =
  'internal.php?object=centreon_topcounter&action=hosts_status';

const numberFormat = yup.number().required().integer();

const statusSchema = yup.object().shape({
  down: yup.object().shape({
    total: numberFormat,
    unhandled: numberFormat,
  }),
  ok: numberFormat,
  pending: numberFormat,
  refreshTime: numberFormat,
  total: numberFormat,
  unreachable: yup.object().shape({
    total: numberFormat,
    unhandled: numberFormat,
  }),
});

interface HostData {
  down: {
    total: number;
    unhandled: number;
  };
  ok: number;
  pending: number;
  total: number;
  unandled: number;
  unreachable: {
    total: number;
    unhandled: number;
  };
}

const HostMenu = (): JSX.Element => {
  const classes = useStyles();

  const { t } = useTranslation();

  const { use_deprecated_pages } = useUserContext();

  const unhandledDownHostsLink = use_deprecated_pages
    ? '/main.php?p=20202&o=h_down&search='
    : getHostResourcesUrl({
        stateCriterias: unhandledStateCriterias,
        statusCriterias: downCriterias,
      });

  const unhandledUnreachableHostsLink = use_deprecated_pages
    ? '/main.php?p=20202&o=h_unreachable&search='
    : getHostResourcesUrl({
        stateCriterias: unhandledStateCriterias,
        statusCriterias: unreachableCriterias,
      });

  const upHostsLink = use_deprecated_pages
    ? '/main.php?p=20202&o=h_up&search='
    : getHostResourcesUrl({
        statusCriterias: upCriterias,
      });

  const hostsLink = use_deprecated_pages
    ? '/main.php?p=20202&o=h&search='
    : getHostResourcesUrl();

  const pendingHostsLink = use_deprecated_pages
    ? '/main.php?p=20202&o=h_pending&search='
    : getHostResourcesUrl({
        statusCriterias: pendingCriterias,
      });

  return (
    <StatusCounter<HostData>
      endpoint={hostStatusEndpoint}
      loaderWidth={27}
      schema={statusSchema}
    >
      {({ hasPending, toggled, toggleDetailedView, data }): JSX.Element => (
        <div className={`${styles.wrapper} wrap-right-hosts`}>
          <SubmenuHeader active={toggled} submenuType="top">
            <IconHeader
              Icon={HostIcon}
              iconName={t('Hosts')}
              pending={hasPending}
              onClick={toggleDetailedView}
            />
            <Link
              className={classnames(classes.link, styles['wrap-middle-icon'])}
              to={unhandledDownHostsLink}
            >
              <IconNumber
                iconColor="red"
                iconNumber={
                  <span id="count-host-down">
                    {numeral(data.down.unhandled).format('0a')}
                  </span>
                }
                iconType={`${data.down.unhandled > 0 ? 'colored' : 'bordered'}`}
              />
            </Link>
            <Link
              className={classnames(classes.link, styles['wrap-middle-icon'])}
              to={unhandledUnreachableHostsLink}
            >
              <IconNumber
                iconColor="gray-dark"
                iconNumber={
                  <span id="count-host-unreachable">
                    {numeral(data.unreachable.unhandled).format('0a')}
                  </span>
                }
                iconType={`${
                  data.unreachable.unhandled > 0 ? 'colored' : 'bordered'
                }`}
              />
            </Link>
            <Link
              className={classnames(classes.link, styles['wrap-middle-icon'])}
              to={upHostsLink}
            >
              <IconNumber
                iconColor="green"
                iconNumber={
                  <span id="count-host-up">
                    {numeral(data.ok).format('0a')}
                  </span>
                }
                iconType={`${data.ok > 0 ? 'colored' : 'bordered'}`}
              />
            </Link>
            <IconToggleSubmenu
              iconType="arrow"
              rotate={toggled}
              onClick={toggleDetailedView}
            />
            <div
              className={classnames(styles['submenu-toggle'], {
                [styles['submenu-toggle-active'] as string]: toggled,
              })}
            >
              <SubmenuItems>
                <Link
                  className={classes.link}
                  to={hostsLink}
                  onClick={toggleDetailedView}
                >
                  <SubmenuItem
                    submenuCount={numeral(data.total).format()}
                    submenuTitle={t('All')}
                  />
                </Link>
                <Link
                  className={classes.link}
                  to={unhandledDownHostsLink}
                  onClick={toggleDetailedView}
                >
                  <SubmenuItem
                    dotColored="red"
                    submenuCount={`${numeral(data.down.unhandled).format(
                      '0a',
                    )}/${numeral(data.down.total).format('0a')}`}
                    submenuTitle={t('Down')}
                  />
                </Link>
                <Link
                  className={classes.link}
                  to={unhandledUnreachableHostsLink}
                  onClick={toggleDetailedView}
                >
                  <SubmenuItem
                    dotColored="gray"
                    submenuCount={`${numeral(data.unreachable.unhandled).format(
                      '0a',
                    )}/${numeral(data.unreachable.total).format('0a')}`}
                    submenuTitle={t('Unreachable')}
                  />
                </Link>
                <Link
                  className={classes.link}
                  to={upHostsLink}
                  onClick={toggleDetailedView}
                >
                  <SubmenuItem
                    dotColored="green"
                    submenuCount={numeral(data.ok).format()}
                    submenuTitle={t('Up')}
                  />
                </Link>
                <Link
                  className={classes.link}
                  to={pendingHostsLink}
                  onClick={toggleDetailedView}
                >
                  <SubmenuItem
                    dotColored="blue"
                    submenuCount={numeral(data.pending).format()}
                    submenuTitle={t('Pending')}
                  />
                </Link>
              </SubmenuItems>
            </div>
          </SubmenuHeader>
        </div>
      )}
    </StatusCounter>
  );
};

export default withTranslation()(HostMenu);