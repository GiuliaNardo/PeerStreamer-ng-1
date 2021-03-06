/*******************************************************************
* PeerStreamer-ng is a P2P video streaming application exposing a ReST
* interface.
* Copyright (C) 2017 Luca Baldesi <luca.baldesi@unitn.it>
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*******************************************************************/

#include<pschannel.h>
#include<ord_set.h>
#include<stdint.h>
#include<string.h>
#include<stdlib.h>
#include<stdio.h>
#include<tokens.h>
#include<debug.h>

int8_t pschannel_cmp(const void *ch1,const  void *ch2)
{
	const struct pschannel *psc1, *psc2;
	int res;

	psc1 = (const struct pschannel *) ch1;
	psc2 = (const struct pschannel *) ch2;
	res = strcmp(psc1->ipaddr, psc2->ipaddr);
	if (res == 0)
		res = strcmp(psc1->port, psc2->port);
	return res;
}

struct pschannel_bucket {
	struct ord_set * channels;
	char * csvfile;
	const struct pstreamer_manager * psm;
};

struct pschannel_bucket * pschannel_bucket_new(const char * csvfilename, const struct pstreamer_manager * psm)
{
	struct pschannel_bucket * pb;
	pb = (struct pschannel_bucket*) malloc(sizeof(struct pschannel_bucket));
	pb->channels = ord_set_new(10, pschannel_cmp);
	pb->psm = psm;
	if (csvfilename)
		pb->csvfile = strdup(csvfilename);
	else
		pb->csvfile = NULL;
	return pb;
}

uint8_t pschannel_bucket_insert(struct pschannel_bucket * pb, const char * name, const char * ip, const char * port, const char * quality, const char * sdpfile)
{
	struct pschannel * ch;
	void * res;

	if (pb && name && ip && port && quality && sdpfile)
	{
		ch = (struct pschannel *) malloc(sizeof(struct pschannel));
		memset(ch, 0, sizeof(struct pschannel));
		strncpy(ch->name, name, MAX_NAME_LENGTH-1);
		strncpy(ch->ipaddr, ip, MAX_IPADDR_LENGTH-1);
		strncpy(ch->port, port, MAX_PORT_LENGTH-1);
		strncpy(ch->quality, quality, MAX_QUALITY_LENGTH-1);
		strncpy(ch->sdpfile, sdpfile, MAX_SDPFILENAME_LENGTH-1);

		res = ord_set_insert(pb->channels, ch, 0);
		if (res != ch)  // there is a conflict
			ord_set_insert(pb->channels, ch, 1);  // we just override the current value
		return 0;
	}
	else
		return 1;
}

const struct pschannel * pschannel_bucket_iter(const struct pschannel_bucket * pb, const struct pschannel * iter)
{
	const struct pschannel * res = NULL;

	if (pb)
		res = (const struct pschannel *) ord_set_iter(pb->channels, (const void *) iter);
	return res;
}

void pschannel_bucket_destroy(struct pschannel_bucket ** pb)
{
	if(pb && *pb)
	{
		ord_set_destroy(&((*pb)->channels), 1);
		if ((*pb)->csvfile)
			free((*pb)->csvfile);
		free(*pb);
		*pb = NULL;
	}
}

char * pschannel_bucket_to_json(const struct pschannel_bucket * pb)
{
	char objstr[] = "{\"name\":\"\",\"ipaddr\":\"\",\"port\":\"\",\"quality\":\"\"},";
	size_t reslength, i;
	char * res = NULL;
	const struct pschannel * iter;

	if (pb)
	{
		reslength = strlen("[]") + (strlen(objstr) + MAX_NAME_LENGTH + 
			MAX_IPADDR_LENGTH + MAX_PORT_LENGTH + MAX_QUALITY_LENGTH) * 
			   ord_set_length(pb->channels) + 1;

		res = (char *) malloc (sizeof(char) * reslength);

		res[0] = '[';
		i = 1;
		for(iter = NULL; (iter = pschannel_bucket_iter(pb, iter));)
		{
			if (i > 1)
				res[i++] = ',';
			i += sprintf(res+i, "{\"name\":\"%s\",\"ipaddr\":\"%s\",\"port\":\"%s\",\"quality\":\"%s\"}", 
					iter->name, iter->ipaddr, iter->port, iter->quality);
		}
		res[i] = ']'; i++;
		res[i] = '\0'; i++;
	}

	return res;
}

const struct pschannel * pschannel_bucket_find(const struct pschannel_bucket * psb, const char * ipaddr, const char * port)
{
	struct pschannel ch;
	
	if (ipaddr && port)
	{
		strncpy(ch.ipaddr, ipaddr, MAX_IPADDR_LENGTH);
		strncpy(ch.port, port, MAX_PORT_LENGTH);
		return (const struct pschannel *) ord_set_find(psb->channels, &ch);

	} else
		return NULL;
}

int8_t pschannel_bucket_reset(struct pschannel_bucket * psb)
{
	if (psb)
	{
		ord_set_destroy(&(psb->channels), 1);
		psb->channels = ord_set_new(10, pschannel_cmp);
		return 0;
	}
	return 1;
}

int8_t pschannel_bucket_loadfile(struct pschannel_bucket * psb)
{
	int8_t res = -1;
	int ans;
	FILE *fp;
	char line[255];
	char ** tokens;
	uint32_t ntoks;
	
	if (psb && psb->csvfile && (fp = fopen(psb->csvfile, "r")))
	{
		ans = ftrylockfile(fp);
		if (ans == 0)
		{
			debug("Refresing channel list from file\n");
			while (fgets(line, 255, fp) != NULL)
			{
				tokens = tokens_create(line, ',', &ntoks);
				if (tokens[0][0] != '#' && ntoks == 5)
					pschannel_bucket_insert(psb, tokens[0], tokens[1], tokens[2], tokens[3], tokens[4]);
				tokens_destroy(&tokens, ntoks);
			}
			res = 0;
			funlockfile(fp);
		} else
			res = -2;
		fclose(fp);
	}
	return res;
}

int8_t pschannel_bucket_save2file(struct pschannel_bucket * psb)
{
	int8_t res = -1;
	FILE *fp;
	char sdpfile_out[MAX_SDPFILENAME_LENGTH+4];
	char ** tokens;
	uint32_t ntoks;
	const struct pschannel * iter = NULL;
	
	if (psb && psb->csvfile)
	{
		tokens = tokens_create(psb->csvfile, '.', &ntoks);
		snprintf(sdpfile_out, MAX_SDPFILENAME_LENGTH, "%s_out.csv", tokens[0]);
		tokens_destroy(&tokens, ntoks);

		if ((fp = fopen(sdpfile_out, "w")))
		{
			if (ftrylockfile(fp) == 0)
			{
				debug("Dumping channel list to file\n");
				for(iter = NULL; (iter = pschannel_bucket_iter(psb, iter));)
					fprintf(fp, "%s,%s,%s,%s,%s\n", iter->name, iter->ipaddr, iter->port,
							iter->quality, iter->sdpfile);
				funlockfile(fp);
				res = 0;
			}
			fclose(fp);
		}
	}
	return res;
}

int8_t pschannel_bucket_load_local_streams(struct pschannel_bucket * pb)
{
	int8_t res = -1;
	const struct pstreamer * ps = NULL;

	if (pb && pb->psm)
	{
		while ((ps = pstreamer_manager_source_iter(pb->psm, ps)))
			if (pstreamer_get_display_name(ps))
				pschannel_bucket_insert(pb, pstreamer_get_display_name(ps), pstreamer_source_ipaddr(ps), pstreamer_source_port(ps), "good", "nosdpfile");
		res = 0;
	}
	return res;
}
