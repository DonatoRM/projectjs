<?php

namespace Api\Models;

use Api\Models\Base\Orm;

class Users_installationsModel extends Orm
{
    public function __construct(int $role = 0)
    {
        $params = array('idInstallation', 'username', 'page', 'limit');
        $attributes = ['idInstallation', 'username'];
        parent::__construct('users_installations', $params, $attributes, $role);
    }
}