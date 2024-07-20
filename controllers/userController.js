const Org = require('../models/organisation');
const User = require('../models/user');

const getData = async (req, res) => {
    try {
        const userId  = req.params.id;
        console.log(userId);
        const user = await User.findByPk(userId);
        console.log("User", user);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        };

        res.status(200).json({
            status: 'success',
            message: 'User retrived succesfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({status: 'error', message: error.message});
    }
};
const { Sequelize, Op } = require('sequelize');

const getUserData = async (req, res) => {
    try {
        const userId = req.params.id;
        const requestingUserId = req.user.userId;
        console.log("UserID:", userId);
        console.log("RequestingId:", requestingUserId);
    
        // Find the user by ID
        const user = await User.findByPk(userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Check if the requesting user is the same as the user being requested
        if (userId === requestingUserId) {
          return res.status(200).json({
            status: 'success',
            message: 'User record retrieved successfully',
            data: {
              userId: user.userId,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phone: user.phone,
            }
          });
        }
    
        // Check if the requesting user belongs to the same organization
        const userOrganisations = await Org.findAll({
          include: [{
            model: User,
            where: { userId: { [Op.eq]: userId } },
          }]
        });
    
        const requestingUserOrganisations = await Org.findAll({
          include: [{
            model: User,
            where: { userId: { [Op.eq]: requestingUserId } },
          }]
        });
    
        const sharedOrganisation = userOrganisations.some(org =>
          requestingUserOrganisations.some(rOrg => rOrg.orgId === org.orgId)
        );
    
        if (!sharedOrganisation) {
          return res.status(403).json({ message: 'You do not have access to this user\'s record' });
        }
    
        // If the user belongs to the same organization
        return res.status(200).json({
          status: 'success',
          message: 'User record retrieved successfully',
          data: {
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
          }
        });
    
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

  


module.exports = getUserData;