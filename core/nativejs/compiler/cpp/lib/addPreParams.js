/*
 * This file is part of NectarJS
 * Copyright (c) 2019 Adrien THIERRY
 * http://nectarjs.com - https://nectrium.com
 *
 * sources : https://github.com/nectarjs/nectarjs
 *
 * NectarJS
 * Copyright (C) 2019 Adrien THIERRY - Necrium
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

module.exports = addPreParams;
function addPreParams(obj)
{
  var str = [];
	for(var o in obj)
	{
    if( (obj[o].type == "UnaryExpression" || obj[o].type == "UpdateExpression") && obj[o].argument.type == "Identifier" )
    {
      var tmp = "";
      if(obj[o].argument.loc.start.line < obj[o].loc.start.line || (obj[o].argument.loc.start.line == obj[o].loc.start.line &&
        obj[o].argument.loc.end.column < obj[o].loc.end.column))
      {
        tmp += obj[o].argument.name + ".value.i" + obj[o].operator;
      }
      else
        tmp += obj[o].operator + obj[o].argument.name + ".value.Integer";
      tmp += ";"

      str.push(tmp);
    }
    else if( obj[o].type == "UnaryExpression" || obj[o].type == "UpdateExpression" )
    {
      var target = getRecursiveType(obj[o]);
      var from =
      {
        type: obj[o].type,
        operator: obj[o].operator,
        argument: target,
        prefix: true,
        loc: obj[o].loc,
      }

      if(obj[o].argument.loc.start.line < obj[o].loc.start.line || (obj[o].argument.loc.start.line == obj[o].loc.start.line &&
        obj[o].argument.loc.end.column < obj[o].loc.end.column))
      {
        str.push(from);
        str.push(addPreParams([obj[o].argument]));
      }
      else
      {
        str.push(addPreParams([obj[o].argument]));
        str.push(addPreParams([from]));
      }
    }
	}

	return str.join(';');

}
