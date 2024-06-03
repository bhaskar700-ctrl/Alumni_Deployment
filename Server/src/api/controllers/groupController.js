// controllers/GroupController.js
import Group from '../models/Group.js';

class GroupController {
    async createGroup(req, res) {
        const { name, memberIds } = req.body;
        try {
            const group = new Group({
                name,
                members: [req.user._id, ...memberIds]
            });
            await group.save();
            res.status(201).json(group);
        } catch (error) {
            res.status(500).json({ message: 'Error creating group: ' + error.message });
        }
    }

    async addMember(req, res) {
        const { groupId } = req.params;
        const { memberId } = req.body;
        try {
            const group = await Group.findById(groupId);
            if (!group) {
                return res.status(404).json({ message: 'Group not found' });
            }
            if (!group.members.includes(memberId)) {
                group.members.push(memberId);
                await group.save();
            }
            res.status(200).json(group);
        } catch (error) {
            res.status(500).json({ message: 'Error adding member to group: ' + error.message });
        }
    }

    async removeMember(req, res) {
        const { groupId } = req.params;
        const { memberId } = req.body;
        try {
            const group = await Group.findById(groupId);
            if (!group) {
                return res.status(404).json({ message: 'Group not found' });
            }
            group.members = group.members.filter(id => id.toString() !== memberId.toString());
            await group.save();
            res.status(200).json(group);
        } catch (error) {
            res.status(500).json({ message: 'Error removing member from group: ' + error.message });
        }
    }

    async getUserGroups(req, res) {
        try {
            const groups = await Group.find({ members: req.user._id });
            res.status(200).json(groups);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving groups: ' + error.message });
        }
    }
}

export default new GroupController();
