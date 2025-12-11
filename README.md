Le dashboard officiel de la pool de minage Les Chauffagistes

Ce dashboard repose sur 2 services :
- **L'API publique**: https://chauffagistes-pool.fr:3000
- **Un serveur d'historique**: https://github.com/Les-Chauffagistes/history-server

En l'état, vous ne pouvez pas héberger votre propre instance du dashboard car il repose sur une base de données peuplée par le serveur d'historique, qui exploite lui même une API privée.

Cependant, le code source est disponible ici, et vous pouvez démarrer le dashboard avec des données d'historique de test. 

Pour démarrer, initialisez le projet next.js :

```shell
npm i
```

Démarrez une base de données Postgres (via Docker par exemple) et configurez les variables d'environnement en utilisant le modèle. Puis initialisez la BDD

```shell
npx prisma migrate deploy
npx prisma db push
npx prisma generate
```

Puis peuplez la avec le script fixture.sql

Démarrez le dashboard avec 

```shell
npx run dev
```