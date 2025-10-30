INSTRUCCIONES PARA EL DESARROLLO DE LA PRUEBA
=============================================

El objetivo del ejercicio es modificar la lectura de los datos de la aplicación,
para que sea una base de datos MySQL en lugar de un fichero JSON. Además,
documentaremos el proceso realizando subidas del código a Github.
Realiza capturas de pantalla de cada paso.

Es super importante seguir el orden de los pasos que se indican a continuación:

01) 
Crea un repositorio en tu cuenta de Github y llámalo "castanyada".
Incluye un fichero readme.md con todo el texto de este fichero.

02)
Inicia un repositorio local.
Configura adecuadamente el fichero ".gitignore", pero él debe poder
subir a Github.
Crea una rama llamada "JSON".
Desde esa rama haz un push al repo de Github.

03)
Vuelve a la rama "master" y cámbiale el nombre a "main".
Añade un fichero con tu nombre y el enlace al repositori de Github.

04)
Crea una base de datos que se llamará "Umm-tuNombre" (óbviamente se trata de tu nombre ).
En ella crea una tabla de nombre "sweets", que incluya los datos del fichero JSON que 
está en la carpeta data del proyecto. 

05)
Crea un usuario en MySQL de nombre "magda" y contraseña "magda".
Asígnale permisos de consulta, inserción, actualización y borrado de datos para la
base de datos "Umm-tuNombre" y todas las tablas que contenga.

06)
Desde el usuario "magda" (no "root") traslada los datos de los productos 
del fichero JSON a la base de datos.

07) 
Exporta la base de datos con la tabla llena de registros, 
de tal modo que sea totalmente utilizable en otro
equipo. Asegúrate de ello. La añades a la carpeta "data".
Después haz un push a Github.

08)
En el proyecto, haz lo necesario para poder utilizar el módulo "mysql2".
Configura la conexión.

09)
Haz las modificaciones en el código del proyecto para que lea la información
de la base de datos. El formulario de la ruta "/admin" debe poder añadir 
productos en la tabla.

10)
Añade un fichero con tu nombre y el enlace al repositori de Github
Haz el último push a Github.


REPITO : cada paso de ir acompañado de una captura de pantalla explícita del proceso.
Además de lo que se indica en cada paso.

ENLACE AL VIDEO :  https://youtu.be/79dNMUOlRmI

