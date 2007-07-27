<?
/**
Oreon is developped with GPL Licence 2.0 :
http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt
Developped by : Julien Mathis - Romain Le Merlus

The Software is provided to you AS IS and WITH ALL FAULTS.
OREON makes no representation and gives no warranty whatsoever,
whether express or implied, and without limitation, with regard to the quality,
safety, contents, performance, merchantability, non-infringement or suitability for
any particular or intended purpose of the Software found on the OREON web site.
In no event will OREON be liable for any direct, indirect, punitive, special,
incidental or consequential damages however they may arise and even if OREON has
been previously advised of the possibility of such damages.

For information : contact@oreon-project.org
*/

	if (!isset ($oreon))
		exit ();
	
	isset($_GET["host_id"]) ? $hG = $_GET["host_id"] : $hG = NULL;
	isset($_POST["host_id"]) ? $hP = $_POST["host_id"] : $hP = NULL;
	$hG ? $host_id = $hG : $host_id = $hP;

	# HOST LCA	
	if (!array_key_exists($host_id, $oreon->user->lcaHost))	{
		#Pear library
		require_once "HTML/QuickForm.php";
		require_once 'HTML/QuickForm/advmultiselect.php';
		require_once 'HTML/QuickForm/Renderer/ArraySmarty.php';
		
		#Path to the configuration dir
		#Path to the configuration dir
		global $path;		
		$path = "./include/inventory/server/";		

		#PHP functions
		//require_once $path."DB-Func.php";
		require_once "./include/common/common-Func.php";
		
			switch ($o)	{
				case "w" : require_once($path."infosServer.php"); break; #Watch a host
				default : require_once($path."listServer.php"); break;
			}
	}
?>