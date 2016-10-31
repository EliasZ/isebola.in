<?php
/**
 * https://stackoverflow.com/questions/14750275/haversine-formula-with-php
 * Calculates the great-circle distance between two points, with
 * the Haversine formula.
 * @param float $latitudeFrom Latitude of start point in [deg decimal]
 * @param float $longitudeFrom Longitude of start point in [deg decimal]
 * @param float $latitudeTo Latitude of target point in [deg decimal]
 * @param float $longitudeTo Longitude of target point in [deg decimal]
 * @param float $earthRadius Mean earth radius in [km]
 * @return float Distance between points in [km] (same as earthRadius)
 */
function haversineGreatCircleDistance(
    $latitudeFrom, $longitudeFrom, $latitudeTo, $longitudeTo, $earthMeanRadius = 6371)
{
    $deltaLatitude = deg2rad($latitudeTo - $latitudeFrom);
    $deltaLongitude = deg2rad($longitudeTo - $longitudeFrom);
    $a = sin($deltaLatitude / 2) * sin($deltaLatitude / 2) +
        cos(deg2rad($latitudeFrom)) * cos(deg2rad($latitudeTo)) *
        sin($deltaLongitude / 2) * sin($deltaLongitude / 2);
    $c = 2 * atan2(sqrt($a), sqrt(1-$a));
    return $earthMeanRadius * $c;
}

/**
 * Return response to client
 * @param array $data Response data
 */
function r($data) {
    echo json_encode($data);
    die;
}

// @-sign to mute e-warning if API is down/not accessible
//$apiData = @json_decode(file_get_contents('dummy.json'), true);
$apiData = @json_decode(file_get_contents('https://maps.googleapis.com/maps/api/geocode/json?language=en&address=' . urlencode($_GET['address'])), true);

// Check if API responds as
if ($apiData === null || ! isset($apiData['results']) || count($apiData['results']) < 1) {
    r([
        'state' => false,
        'message' => 'Something went wrong with tracking Ebola there. Some suggestions: try a different place, try again later or ping the administrator.'
    ]);
}

$apiLocation = $apiData['results'][0];
$apiLocationCountry = array_pop($apiLocation['address_components']);

// https://github.com/cmrivers/Ebola/blob/master/map_data/locations.geojson
$locationData = json_decode(file_get_contents('locations.json'), true);

$smallestDistance = PHP_INT_MAX;
$affectedLocation = [];
$countryIsAffected = false;

// Iterate over all Ebola cases and find nearest case
foreach ($locationData['features'] as $location) {
    $distance = haversineGreatCircleDistance(
        (float) $location['geometry']['coordinates'][1],
        (float) $location['geometry']['coordinates'][0],
        (float) $apiLocation['geometry']['location']['lat'],
        (float) $apiLocation['geometry']['location']['lng']
    );

    // Check if country is affected
    if (! $countryIsAffected && strtolower($location['properties']['country']) === strtolower($apiLocationCountry['long_name'])) {
        $countryIsAffected = true;
    }

    // Find the nearest Ebola
    if ($distance < $smallestDistance) {
        $smallestDistance = $distance;
        $affectedLocation = $location['properties'];
    }
}

// Convert nearest case to imperial system if requested
if (isset($_GET['imp']) && $_GET['imp'] == 'true') {
    $smallestDistance = round($smallestDistance * 0.621371) . ' miles';
} else {
    $smallestDistance = round($smallestDistance) . ' kilometers';
}

// Build some fancy message
$message = 'There is ';
if (! $countryIsAffected) {
    $message .= 'no ';
}

$message .= 'Ebola in <span class="faded">' . $apiLocationCountry['long_name'] . '</span>. ';

if ($countryIsAffected) {
    if ($smallestDistance > 2500) {
        $message .= $apiLocation['address_components'][0]['long_name'] . ' is however pretty far from any casualties.';
    } elseif ($smallestDistance > 1500) {
        $message .= 'Unless you are interacting with Ebola patients without protection, you are probably OK.';
    } elseif ($smallestDistance > 500) {
        $message .= $apiLocation['address_components'][0]['long_name'] . ' is <span class="faded">' . $smallestDistance . '</span> away from any incidents.';
    } elseif ($smallestDistance > 250) {
        $message .= $smallestDistance . ': Ebola is close. ' . $apiLocation['address_components'][0]['long_name'] . ' is not hit but why would you risk it?';
    } elseif ($smallestDistance > 50) {
        $message .= 'Though not airborne, Ebola at <span class="faded">' . $smallestDistance . '</span> away might be considered dangerous if you do not know what you are doing.';
    } elseif ($smallestDistance > 10) {
        $message .= 'People have ran farther distances than <span class="faded">' . $smallestDistance . '</span> without getting tired. Take caution.';
    } elseif ($smallestDistance > 5) {
        $message .= 'Ebola is luring at a <span class="faded">' . $smallestDistance . '</span> distance. Stay safe.';
    }
} else {
    $message .= ' You are <span class="faded">' . $smallestDistance . '</span> away from any Ebola casualties.';
}

r([
    'state' => true,
    'message' => $message,
    'affected_location' => implode($affectedLocation, ', '),
    'affected_distance' => $smallestDistance,
    'formatted_address' => $apiLocation['formatted_address']
]);
