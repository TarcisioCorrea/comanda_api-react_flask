import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
    page: {
        padding: 20,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    table: {
        width: '100%',
        border: '1px solid #000',
        borderRadius: 5,
        marginTop: 10,
        borderCollapse: 'collapse',
    },
    tableHeader: {
        backgroundColor: '#f2f2f2',
        textAlign: 'center',
        padding: 5,
        fontWeight: 'bold',
        borderBottom: '1px solid #000',
    },
    tableCell: {
        textAlign: 'center',
        padding: 5,
        borderBottom: '1px solid #000',
    },
    tableRow: {
        flexDirection: 'row',
    },
});

export default styles;