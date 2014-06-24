<?php
    if (isset($_POST["data"])) {
        //Create data folder if it does not already exist
        if (!is_dir("protected/data/")) {
            echo "mkdir";
            mkdir("protected/data", 0755, true);
        }

        //Generate unique filename
        do {
            $filename = "protected/data/" . uniqid() . ".json";
        } while (file_exists($filename));

        //Write JSON to file
        $file = fopen($filename, "a");
        fwrite($file, $_POST["data"] . "\n");
        fclose($file);
        echo "data received";
    } else {
        echo "data not received";
    }
?>