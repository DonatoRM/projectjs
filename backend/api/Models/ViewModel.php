<?php

namespace Api\Models;

use Api\Models\Base\Orm;

class ViewModel extends Orm
{
    public function __construct(int $role = 0)
    {
        $username=$_SERVER['PHP_AUTH_USER'];
        $this->query = "select c.name as client,i.name as installation,l.name as location,p.name as position,p.element as element,p.point as point,p.fase as fase,d.date as date,d.point_temperature as temp,d.reference_temperature as tref,d.maximum_current as imax,d.current as ir from installations i inner join clients c on i.client=c.id inner join locations l on i.id=l.installation inner join positions p on l.id=p.location inner join defects d on p.id=d.position where i.id=(select IdInstallation from users_installations where username='$username');";
        $params = array('id', 'name', 'page', 'limit');
        $attributes = ['name', 'address', 'cp', 'country', 'province', 'municipality', 'location', 'phone', 'email'];
        parent::__construct('clients', $params, $attributes, $role);
    }
}