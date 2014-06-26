<?php
    if (isset($_POST["data"])) {
        //Create data folder if it does not already exist
        if (!is_dir("protected/data/")) {
            echo "mkdir";
            mkdir("protected/data", 0755, true);
        }

        //Generate unique id/filename
        do {
            $uid = uniqid();
            $filename = "protected/data/" . $uid . ".json";
        } while (file_exists($filename));

        //Store id in JSON
        $data = json_decode($_POST["data"]);
        $data->id = $uid;
        $dataString = json_encode($data);
        //Write JSON to file
        $file = fopen($filename, "a");
        fwrite($file, $dataString);
        fclose($file);
        echo "data received";
    } else {
        echo "data not received";
    }
?>