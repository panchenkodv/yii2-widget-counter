<?php

/**
 * Created by PhpStorm.
 * User: alone
 * Date: 21.11.16
 * Time: 19:54
 */

namespace panchenkodv\counter;

/**
 * Class CounterAsset
 * @package panchenkodv\counter
 */
class CounterAsset extends \yii\web\AssetBundle
{
    public $depends = [
        'yii\web\YiiAsset',
        'yii\web\JqueryAsset'
    ];

    public $sourcePath = '@vendor/panchenkodv/yii2-widget-counter/assets/';

    public $css = [
        'css/style.css',
    ];

    public $js = [
        'js/main.js',
    ];
}
