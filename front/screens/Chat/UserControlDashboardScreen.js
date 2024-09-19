import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, FlatList, Alert, Modal, ScrollView } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';

const UserControlDashboardScreen = () => {
    const [profile, setProfile] = useState({
        username: '',
        statusMessage: '',
        profileImage: '',
    });
    const [securitySettings, setSecuritySettings] = useState({
        twoFactorAuth: false,
        encryptionEnabled: false,
        blockedUsers: [],
    });
    const [activityStats, setActivityStats] = useState([]);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showBlockedUsers, setShowBlockedUsers] = useState(false);
    const [newStatusMessage, setNewStatusMessage] = useState('');
    const [backupEnabled, setBackupEnabled] = useState(false);
    const [showSecurityModal, setShowSecurityModal] = useState(false);

    useEffect(() => {
        fetchUserProfile();
        fetchSecuritySettings();
        fetchActivityStats();
    }, []);

    // Fetch user profile from server
    const fetchUserProfile = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/user/profile`);
            setProfile(response.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    // Fetch security settings from server
    const fetchSecuritySettings = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/user/security-settings`);
            setSecuritySettings(response.data);
        } catch (error) {
            console.error('Error fetching security settings:', error);
        }
    };

    // Fetch activity stats
    const fetchActivityStats = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/user/activity-stats`);
            setActivityStats(response.data);
        } catch (error) {
            console.error('Error fetching activity stats:', error);
        }
    };

    // Save updated profile
    const saveProfile = async () => {
        try {
            await axios.post(`${process.env.API_URL}/user/update-profile`, {
                statusMessage: newStatusMessage,
            });
            Alert.alert('Success', 'Profile updated successfully!');
            setShowEditProfile(false);
            fetchUserProfile();
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', 'Failed to update profile.');
        }
    };

    // Toggle two-factor authentication
    const toggleTwoFactorAuth = async () => {
        try {
            await axios.post(`${process.env.API_URL}/user/toggle-two-factor`, {
                enabled: !securitySettings.twoFactorAuth,
            });
            setSecuritySettings({ ...securitySettings, twoFactorAuth: !securitySettings.twoFactorAuth });
            Alert.alert('Success', 'Two-factor authentication updated.');
        } catch (error) {
            console.error('Error toggling two-factor auth:', error);
            Alert.alert('Error', 'Failed to update security settings.');
        }
    };

    // Render blocked users list
    const renderBlockedUser = ({ item }) => (
        <View style={styles.blockedUserContainer}>
            <Text style={styles.blockedUserName}>{item.username}</Text>
            <TouchableOpacity onPress={() => unblockUser(item.id)}>
                <Text style={styles.unblockButton}>Unblock</Text>
            </TouchableOpacity>
        </View>
    );

    // Unblock a user
    const unblockUser = async (userId) => {
        try {
            await axios.post(`${process.env.API_URL}/user/unblock`, { userId });
            setSecuritySettings({
                ...securitySettings,
                blockedUsers: securitySettings.blockedUsers.filter((user) => user.id !== userId),
            });
            Alert.alert('Success', 'User unblocked.');
        } catch (error) {
            console.error('Error unblocking user:', error);
            Alert.alert('Error', 'Failed to unblock user.');
        }
    };

    // Toggle backup settings
    const toggleBackup = async () => {
        try {
            await axios.post(`${process.env.API_URL}/user/toggle-backup`, {
                enabled: !backupEnabled,
            });
            setBackupEnabled(!backupEnabled);
            Alert.alert('Success', 'Backup setting updated.');
        } catch (error) {
            console.error('Error toggling backup:', error);
            Alert.alert('Error', 'Failed to update backup settings.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            {/* Profile Section */}
            <View style={styles.profileSection}>
                <TouchableOpacity onPress={() => setShowEditProfile(true)}>
                    <Image source={{ uri: profile.profileImage }} style={styles.profileImage} />
                </TouchableOpacity>
                <Text style={styles.username}>{profile.username}</Text>
                <Text style={styles.statusMessage}>{profile.statusMessage}</Text>
            </View>

            {/* Security Settings Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Security Settings</Text>
                <TouchableOpacity style={styles.securityOption} onPress={toggleTwoFactorAuth}>
                    <Icon name={securitySettings.twoFactorAuth ? 'lock-closed' : 'lock-open'} size={24} color="#333" />
                    <Text style={styles.securityText}>
                        Two-Factor Authentication: {securitySettings.twoFactorAuth ? 'Enabled' : 'Disabled'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowSecurityModal(true)} style={styles.securityOption}>
                    <Icon name="settings-outline" size={24} color="#333" />
                    <Text style={styles.securityText}>Manage Security Settings</Text>
                </TouchableOpacity>
            </View>

            {/* Activity Stats Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Activity Statistics</Text>
                <FlatList
                    data={activityStats}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.statsContainer}>
                            <Text style={styles.statsTitle}>{item.title}</Text>
                            <Text style={styles.statsValue}>{item.value}</Text>
                        </View>
                    )}
                />
            </View>

            {/* Blocked Users Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Blocked Users</Text>
                <TouchableOpacity onPress={() => setShowBlockedUsers(true)}>
                    <Text style={styles.viewAll}>View All</Text>
                </TouchableOpacity>
            </View>

            {/* Backup Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Data Management</Text>
                <TouchableOpacity style={styles.backupOption} onPress={toggleBackup}>
                    <Icon name={backupEnabled ? 'cloud-upload' : 'cloud-offline'} size={24} color="#333" />
                    <Text style={styles.backupText}>
                        Backup: {backupEnabled ? 'Enabled' : 'Disabled'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Edit Profile Modal */}
            <Modal visible={showEditProfile} animationType="slide" onRequestClose={() => setShowEditProfile(false)}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Edit Profile</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Update your status message..."
                        value={newStatusMessage}
                        onChangeText={setNewStatusMessage}
                    />
                    <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* Blocked Users Modal */}
            <Modal visible={showBlockedUsers} animationType="slide" onRequestClose={() => setShowBlockedUsers(false)}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Blocked Users</Text>
                    <FlatList data={securitySettings.blockedUsers} keyExtractor={(item) => item.id.toString()} renderItem={renderBlockedUser} />
                    <TouchableOpacity style={styles.closeButton} onPress={() => setShowBlockedUsers(false)}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* Security Modal */}
            <Modal visible={showSecurityModal} animationType="slide" onRequestClose={() => setShowSecurityModal(false)}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Security Settings</Text>
                    {/* Add more detailed security settings here */}
                    <TouchableOpacity style={styles.closeButton} onPress={() => setShowSecurityModal(false)}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6f8',
    },
    profileSection: {
        alignItems: 'center',
        padding: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    username: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    statusMessage: {
        fontSize: 14,
        color: '#666',
    },
    section: {
        marginVertical: 15,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    securityOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    securityText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    statsTitle: {
        fontSize: 16,
        color: '#333',
    },
    statsValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007bff',
    },
    viewAll: {
        color: '#007bff',
        fontSize: 14,
    },
    backupOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    backupText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    modalContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 20,
    },
    saveButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    blockedUserContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    blockedUserName: {
        fontSize: 16,
        color: '#333',
    },
    unblockButton: {
        color: '#007bff',
        fontSize: 14,
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default UserControlDashboardScreen;
