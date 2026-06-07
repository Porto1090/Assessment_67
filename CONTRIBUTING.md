# Contribution Guidelines

Este documento establece el flujo de trabajo esperado para las contribuciones al proyecto, así como las reglas y buenas prácticas para colaborar de forma efectiva.

## Table of Contents

- [Uso de Issues](#uso-de-issues)
- [Creación de ramas](#creación-de-ramas)
- [Tests Locales](#tests-locales)
- [Pull Requests (PR)](#pull-requests-pr)
- [Revisión QA & Merge](#revisión-qa--merge)
- [Conventional commits](#conventional-commits)
- [Si algo falla después de un merge](#si-algo-falla-después-de-un-merge)
- [Cómo reportar bugs](#cómo-reportar-bugs)
- [Buenas prácticas adicionales](#buenas-prácticas-adicionales)
- [Atribución](#atribución)

## Uso de Issues
### Agregar nuevas funcionalidades

> Antes de contribuir, se asume que has revisado los [issues pendientes](https://github.com/Porto1090/Assessment_67/issues).

Utilizamos *issues* para dar seguimiento al trabajo, ya sea para nuevas funcionalidades, mejoras o reporte de errores.  
Cada *feature branch* debe estar vinculada a un issue para mantener el orden y la trazabilidad.

Si consideras que una funcionalidad es necesaria, crea un nuevo issue en el repositorio.

## Creación de ramas

Antes de comenzar a trabajar en un issue, crea una rama a partir de `develop` usando el siguiente formato:

`[issue-number]-[titulo-del-issue]`

**Ejemplo:** 

`123-agregar-nueva-funcionalidad`


Esto se puede hacer directamente desde GitHub o usando `gh CLI`, lo que automáticamente vinculará la rama al issue correspondiente.

## Tests Locales

Antes de solicitar un PR:
- Asegurate de revisar el código, mediante `git diff`, para verificar que no haya cambios no deseados, o cambios en archivos no relacionados.
- Asegúrate de realizar pruebas de caja negra y caja blanca en los cambios realizados.

## Pull Requests (PR)

- Crea siempre un **Pull Request (PR)** hacia la rama `develop`.  
- Añade las etiquetas (*labels*) correspondientes.
- Asigna a las personas responsables de revisar y aprobar el PR.
- Asigna a la persona responsable de hacer el merge.
- Incluye una descripción clara y concisa de los cambios realizados. Incluye capturas de pantalla si es necesario.
- Si el PR está relacionado con un issue, con más razón debes seguir el template de PR.

## Revisión QA & Merge

El equipo de QA revisará los cambios propuestos para asegurarse de que:
- Contribuyen efectivamente a la funcionalidad esperada.
- Cumplen con los criterios de aceptación.
- No introducen errores o fallas.

El equipo dejará un comentario explicando que los cambios fueron revisados y aprobados.
Una vez que el PR tenga las revisiones aprobadas requeridas, podrá ser fusionado a `develop` usando la opción **Merge**.

## Conventional commits

- Usar **conventional commits** en minúsculas y en español.
  
Ejemplos:
```
feat: agregar validación de correo en registro
fix: corregir error al guardar expediente
docs: actualizar readme con nuevas instrucciones
```

## Si algo falla después de un merge

Si una funcionalidad mergeada no funciona correctamente:
1. Revertir el commit de merge hecho en `develop`.
2. Reabrir el issue con una descripción clara del problema encontrado.
3. Corregir el problema.
4. Reiniciar el proceso de integración a `develop`.

## Cómo reportar bugs

Al crear un reporte de bug, incluye:
- El comportamiento esperado.
- El comportamiento actual.
- Los pasos para reproducir el bug.

Información adicional útil:
- Capturas de pantalla.
- Logs de consola.
- Mensajes de error.
- Cualquier detalle técnico que pueda ayudar a identificar el problema.

## Buenas prácticas adicionales

- Mantén el código limpio y legible. Lo más atomico posible.
- Siempre deja una línea en blanco al final de cada archivo.
- Usa nombres de variables y funciones descriptivos.
- Evita comentarios innecesarios. El código debe ser autoexplicativo.
- Sigue las convenciones de estilo establecidas en el proyecto.
- Usa revisores asignados, no te auto-apruebes.
- No hagas push directo a `main` ni a `develop`.

## Atribución
Esta guía está basada en el **contributing.md**. [Make your own](https://contributing.md/)!

<p align="right"><a href="#contribution-guidelines">(volver arriba)</a></p>
