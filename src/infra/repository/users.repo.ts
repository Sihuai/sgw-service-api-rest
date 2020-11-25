// import { EntityManager, EntityRepository, Repository } from '../../domain/models/node_modules/typeorm';
// import { IAttachmentRepository } from '../../app/interfaces/attachment.repo';
// import { IPostRepository } from '../../app/interfaces/post.repo';
// import { IThreadRepository } from '../../app/interfaces/thread.repo';
// import { Attachment } from '../../domain/entity/attachment';
// import { Post } from '../../domain/entity/post';
// import { Thread } from '../../domain/entity/thread';

import { User } from "../../domain/models/user"
import { createConnection } from "../utils/oct-orm"

// @EntityRepository(Post)
// export class UsersRepository implements IUsersRepository {
  
// }



createConnection({
  url: 'arangodb://localhost:8529',
  user: 'root',
  password: 'root',
  database: 'mydb',
  syncronize: true,
  entities: [User],
}).then(async (db) => {
  const UserRepository = db.repositoryFor('User')

  // Create a new user
  const john = await UserRepository.create({
    name: 'John',
    email: 'john@email.com'
  })

  john.email = 'contact@john.com'

  // Updates a user
  await UserRepository.update(john)

  // List users
  const users = await UserRepository.findAll()

  // Delete a user
  await UserRepository.deleteByKey(john)
})
