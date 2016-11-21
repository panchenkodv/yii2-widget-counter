<?php
/**
 * Created by PhpStorm.
 * User: alone
 * Date: 21.11.16
 * Time: 20:02
 */

namespace panchenkodv\counter;

use yii\base\Widget;


/**
 * Class Counter
 * @package panchenkodv\counter
 */
class Counter extends Widget
{
    public function init()
    {
        \panchenkodv\counter\CounterAsset::register($this->getView());
    }
}