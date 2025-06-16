import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';

import ptBR from 'date-fns/locale/pt-BR';
import { format } from 'date-fns';

import styles from './pdf-css';

const PdfClienteList = ({ clientes }) => {
    const currentDate = format(new Date(), 'dd/MM/yyyy', { locale: ptBR });

    return (
        <Document>
            <Page style={styles.page}>
                <Text style={styles.header}>Relatório de Clientes</Text>
                <Text style={{ textAlign: 'center', marginBottom: 20 }}>
                    Gerado em: {currentDate}
                </Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableHeader, { width: '10%' }]}>ID</Text>
                        <Text style={[styles.tableHeader, { width: '40%' }]}>Nome</Text>
                        <Text style={[styles.tableHeader, { width: '25%' }]}>CPF</Text>
                        <Text style={[styles.tableHeader, { width: '25%' }]}>Telefone</Text>
                    </View>
                    {clientes.map((cliente) => (
                        <View key={cliente.id_cliente} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { width: '10%' }]}>{cliente.id_cliente}</Text>
                            <Text style={[styles.tableCell, { width: '40%' }]}>{cliente.nome}</Text>
                            <Text style={[styles.tableCell, { width: '25%' }]}>{cliente.cpf}</Text>
                            <Text style={[styles.tableCell, { width: '25%' }]}>{cliente.telefone}</Text>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
};

export default PdfClienteList;
