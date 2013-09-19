<?php 

	try {

			$id = (isset($_GET['id']) ? $_GET['id'] : null);
			$week = (isset($_GET['week']) ? $_GET['week'] : null);
			$url = 'http://football2.myfantasyleague.com/2013/export?TYPE=liveScoring&L='.$id.'&W='.$week.'&JSON=1&DETAILS=1';
			
			//echo $url;

			if ($url) {

				// fetch XML
				$c = curl_init();
				curl_setopt_array($c, array(
					CURLOPT_URL => $url,
					CURLOPT_HEADER => false,
					CURLOPT_TIMEOUT => 10,
					CURLOPT_RETURNTRANSFER => true
				));
				$r = curl_exec($c);
				curl_close($c);

				echo $r;
			}
		} 
	catch (Exception $e) {
		    echo 'Exception: ',  $e->getMessage(), "\n";
		}

	
?>
   
