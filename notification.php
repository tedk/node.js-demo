<?
$icon = $_GET["icon"];
if($icon == null || $icon == "" || $icon == "null" || $icon == "undefined") {
  $iconstr=null;
} else {
  $iconstr=str_replace("_","/",str_replace("-","+",$icon));
  for($i = 0; $i < $_GET["iconPadding"]; ++$i) {
    $iconstr.="=";
  }
}
$text = $_GET["text"];
if($text == null || $text == "null" || $text == "undefined") {
  $text = "";
}
$num = $_GET["num"];
if($num == null || $num == "null" || $num == "undefined" || $num <= 0) {
  $num = "";
}
$app = $_GET["app"];
$time = $_GET["time"];
?>
<html>
	<head>
		<title>Notification</title>
	</head>
	<body text="white" bgcolor="black">
		<table border="0" width="100%">
		  <tr>
                    <td rowspan="2" valign="top" align="left">
                      <? if($iconstr != null) { ?><img src="data:image/png;base64,<?=$iconstr?>"/><? } ?>
                    </td>
		    <td width="100%" valign="top" align="left">
                      <b><?=$app?></b><br/><?=$text?>
                    </td>
                    <td valign="top" align="right">
                      <font size="-1"><?=$num?></font>
                    </td>
		  </tr>
                  <tr>
                    <td colspan="2" valign="bottom" align="right">
                      <font size="-1"><?=$time?></font>
                    </td>
                  </tr>
		</table>
	</body>
</html>
