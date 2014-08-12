<?php
/*
 * Copyright 2005-2014 MERETHIS
 * Centreon is developped by : Julien Mathis and Romain Le Merlus under
 * GPL Licence 2.0.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation ; either version 2 of the License.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
 * PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program; if not, see <http://www.gnu.org/licenses>.
 *
 * Linking this program statically or dynamically with other modules is making a
 * combined work based on this program. Thus, the terms and conditions of the GNU
 * General Public License cover the whole combination.
 *
 * As a special exception, the copyright holders of this program give MERETHIS
 * permission to link this program with independent modules to produce an executable,
 * regardless of the license terms of these independent modules, and to copy and
 * distribute the resulting executable under terms of MERETHIS choice, provided that
 * MERETHIS also meet, for each linked independent module, the terms  and conditions
 * of the license of that module. An independent module is a module which is not
 * derived from this program. If you modify this program, you may extend this
 * exception to your version of the program, but you are not obliged to do so. If you
 * do not wish to do so, delete this exception statement from your version.
 *
 * For more information : contact@centreon.com
 *
 */

$centreon_path = dirname(__DIR__);

/* Define the path to configuration files */
define('CENTREON_ETC', $centreon_path . '/tests/config/');

ini_set('display_errors', 'On');

/* Add classpath to include path */
set_include_path($centreon_path . PATH_SEPARATOR . get_include_path());

define('CENTREON_PATH', $centreon_path);

require_once 'vendor/autoload.php';

spl_autoload_register(function ($classname) use ($centreon_path) {
    $filename = $centreon_path;
    $fullClassPath = explode('\\', $classname);
    
    $mainScope = array_shift($fullClassPath);
    if ($mainScope == 'Centreon') {
        $secondScope = array_shift($fullClassPath);
        switch (strtolower($secondScope)) {
            default:
            case 'internal':
                $filename .= '/core/internal/'.  implode('/', $fullClassPath);
                break;
            case 'controllers':
                $filename .= '/core/controllers/'.  implode('/', $fullClassPath);
                break;
            case 'repository':
                $filename .= '/core/repositories/'.  implode('/', $fullClassPath);
                break;
            case 'models':
                $filename .= '/core/models/'.  implode('/', $fullClassPath);
                break;
            case 'custom':
                $filename .= '/core/custom/'.  implode('/', $fullClassPath);
                break;
        }
    }
    
    $filename .= '.php';
    if (file_exists($filename)) {
        require_once $filename;
    }
});

spl_autoload_register(function ($classname) use ($centreon_path) {
    $filename = $centreon_path . '/modules/';
    $fullClassPath = explode('\\', $classname);
    
    $filename .= array_shift($fullClassPath).'Module';
    $secondScope = array_shift($fullClassPath);
    switch(strtolower($secondScope)) {
        default:
            $filename .= implode('/', $fullClassPath);
            break;
        case 'controllers':
            $filename .= '/controllers/'.  implode('/', $fullClassPath);
            break;
        case 'models':
            $filename .= '/models/'.  implode('/', $fullClassPath);
            break;
        case 'repository':
            $filename .= '/repositories/'.  implode('/', $fullClassPath);
            break;
        case 'internal':
            $filename .= '/internal/'.  implode('/', $fullClassPath);
            break;
        case 'install':
            $filename .= '/install/'.  implode('/', $fullClassPath);
            break;
        case 'api':
            $thirdScope = array_shift($fullClassPath);
            if (strtolower($thirdScope) === 'internal') {
                $filename .= '/api/internal/'.  implode('/', $fullClassPath);
            } elseif (strtolower($thirdScope) === 'rest') {
                $filename .= '/api/rest/'.  implode('/', $fullClassPath);
            } elseif (strtolower($thirdScope) === 'soap') {
                $filename .= '/api/soap/'.  implode('/', $fullClassPath);
            }
            break;
    }
    
    $filename .= '.php';
    if (file_exists($filename)) {
        require_once $filename;
    }
});

spl_autoload_register(function ($classname) use ($centreon_path) {
    $filename = $centreon_path . '/tests/';
    if (preg_match("/Test\\\Centreon\\\(.+)/", $classname, $matches)) {
        if (file_exists($filename.$matches[1].'.php')) {
            require_once $filename.$matches[1].'.php';
        }
    }
});

foreach (glob($centreon_path.'/core/custom/Centreon/*.php') as $filename) {
    require_once $filename;
}
