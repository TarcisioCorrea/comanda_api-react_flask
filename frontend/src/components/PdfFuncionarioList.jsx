import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';

import ptBR from 'date-fns/locale/pt-BR';
import { format } from 'date-fns';

import styles from './pdf-css';

const PdfFuncionarioList = ({ funcionarios }) => {
    const currentDate = format(new Date(), 'dd/MM/yyyy', { locale: ptBR });

    return (
        <Document>
            <Page style={styles.page}>
                <Text style={styles.header}>Relatório de Funcionários</Text>
                <Text style={{ textAlign: 'center', marginBottom: 20 }}>
                    Gerado em: {currentDate}
                </Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableHeader, { width: '10%' }]}>ID</Text>
                        <Text style={[styles.tableHeader, { width: '30%' }]}>Nome</Text>
                        <Text style={[styles.tableHeader, { width: '25%' }]}>CPF</Text>
                        <Text style={[styles.tableHeader, { width: '25%' }]}>Telefone</Text>
                        <Text style={[styles.tableHeader, { width: '10%' }]}>Grupo</Text>
                    </View>
                    {funcionarios.map((funcionario) => (
                        <View key={funcionario.id_funcionario} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { width: '10%' }]}>{funcionario.id_funcionario}</Text>
                            <Text style={[styles.tableCell, { width: '30%' }]}>{funcionario.nome}</Text>
                            <Text style={[styles.tableCell, { width: '25%' }]}>{funcionario.cpf}</Text>
                            <Text style={[styles.tableCell, { width: '25%' }]}>{funcionario.telefone}</Text>
                            <Text style={[styles.tableCell, { width: '10%' }]}>{funcionario.grupo}</Text>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
};

export default PdfFuncionarioList;
