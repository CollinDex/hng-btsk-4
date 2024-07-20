const Org = require('../models/organisation');
const User = require('../models/user');

const createOrganisation = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(422).json({
                errors: [{field: 'name', message: 'Organisation name is required'}]
            })
        };

        const organisaton = await Org.create({name, description});
        await organisaton.addUser(req.user.userId);

        res.status(201).json({
            status: 'success',
            message: 'Organisation created successfully',
            data: {
                orgId: organisaton.orgId,
                name: organisaton.name,
                description: organisaton.description
            }
        });

    } catch (error) {
        res.status(400).json({ 
            status: 'Bad Request', 
            message: 'Client error',
            statusCode: 400
        });
    }
};

const getOrganisations = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId, {
            include: Org
        });
        console.log(req.user.userId);
        console.log('UserOrg:', user);

        if (!user) {
            return res.status(404).json({
              status: 'error',
              message: 'User not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Organisation retrieved succesfully',
            data: {
                organisatons: user.dataValues.Organisations
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const getOrganisation = async (req, res) => {
    try {
        const { orgId } = req.params;

        const organisation = await Org.findByPk(orgId, {
            include: User
        });

        if (!organisation) {
            return res.status(404).json({
                status: 'error',
                message: 'Organisation not found'
            });
        };

        res.status(200).json({
            status: 'success',
            message: 'Organisation retrieved successfully',
            data: {
                orgId: organisation.orgId,
                name: organisation.name,
                description: organisation.description
            }
        });

    } catch (error) {
        res.status(500).json({status: 'error', message:error.message});
    }
};

const addUserToOrganisation = async (req, res) => {
    try {
      const { orgId } = req.params;
      const { userId } = req.body;
  
      const organisation = await Org.findByPk(orgId);
      const user = await User.findByPk(userId);
  
      if (!organisation || !user) {
        return res.status(404).json({
          status: 'error',
          message: 'Organisation or User not found'
        });
      };
  
      await organisation.addUser(user);
  
      res.status(200).json({
        status: 'success',
        message: 'User added to organisation successfully'
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
};

module.exports = {
    createOrganisation,
    getOrganisations,
    getOrganisation,
    addUserToOrganisation
};
