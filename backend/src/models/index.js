import Badge from "./Badge.model.js";
import User from "./user.model.js";
import UserBadge from "./UserBadge.model.js";
import Admin from './Admin.model.js'

// A user can earn multiple badges and A badge can be earned by multiple users.
User.belongsToMany(Badge, { through: UserBadge, foreignKey: 'userId', otherKey: 'badgeId' });
Badge.belongsToMany(User, { through: UserBadge, foreignKey: 'badgeId', otherKey: 'userId' });

const model = { Badge, User, UserBadge, Admin };

export default model;